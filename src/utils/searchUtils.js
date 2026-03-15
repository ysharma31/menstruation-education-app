export const searchContent = (query, content, t) => {
  if (!query || !query.trim()) {
    return { matches: false, score: 0 };
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const searchableText = [
    content.title,
    content.subtitle,
    content.text,
    content.description,
    content.content,
    ...(content.items || [])
  ]
    .filter(Boolean)
    .map(item => typeof item === 'string' ? item : '')
    .join(' ')
    .toLowerCase();

  let score = 0;
  let matchedTerms = 0;

  searchTerms.forEach(term => {
    if (searchableText.includes(term)) {
      matchedTerms++;
      const occurrences = (searchableText.match(new RegExp(term, 'g')) || []).length;
      score += occurrences;
    }
  });

  const matches = matchedTerms > 0;
  const relevanceScore = matchedTerms / searchTerms.length;

  return { matches, score: score * relevanceScore };
};

export const highlightText = (text, query) => {
  if (!query || !text) return text;

  const terms = query.toLowerCase().trim().split(/\s+/);
  let result = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    result = result.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  });

  return result;
};

export const filterSectionsBySearch = (sections, searchQuery, t) => {
  if (!searchQuery || !searchQuery.trim()) {
    return sections.map((_, index) => index);
  }

  const results = sections
    .map((section, index) => {
      const content = {
        title: section.title || '',
        subtitle: section.subtitle || '',
        text: section.text || '',
        description: section.description || '',
        items: section.items || []
      };

      const { matches, score } = searchContent(searchQuery, content, t);
      return { index, matches, score };
    })
    .filter(result => result.matches)
    .sort((a, b) => b.score - a.score)
    .map(result => result.index);

  return results;
};
