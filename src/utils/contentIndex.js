export const getContentIndex = (t) => {
  return [
    {
      page: 'girls',
      pageName: t('navigation.girls'),
      icon: 'User',
      color: 'pink',
      sections: [
        {
          id: 'basics',
          title: t('girls.basics.title'),
          keywords: ['period', 'menstruation', 'what is', 'basics', 'माहवारी', 'पीरियड'],
          path: '/girls'
        },
        {
          id: 'body',
          title: t('girls.body.title'),
          keywords: ['body', 'anatomy', 'uterus', 'ovaries', 'शरीर', 'गर्भाशय'],
          path: '/girls'
        },
        {
          id: 'products',
          title: t('girls.products.title'),
          keywords: ['pad', 'tampon', 'cup', 'menstrual cup', 'products', 'पैड', 'कप'],
          path: '/girls'
        },
        {
          id: 'hygiene',
          title: t('girls.hygiene.title'),
          keywords: ['hygiene', 'clean', 'wash', 'care', 'स्वच्छता', 'साफ'],
          path: '/girls'
        },
        {
          id: 'myths',
          title: t('girls.myths.title'),
          keywords: ['myths', 'facts', 'truth', 'मिथक', 'सच'],
          path: '/girls'
        },
        {
          id: 'tracker',
          title: t('girls.tracker.title'),
          keywords: ['track', 'calendar', 'cycle', 'ट्रैक', 'कैलेंडर'],
          path: '/girls'
        }
      ]
    },
    {
      page: 'boys',
      pageName: t('navigation.boys'),
      icon: 'Users',
      color: 'blue',
      sections: [
        {
          id: 'basics',
          title: t('boys.basics.title'),
          keywords: ['period', 'menstruation', 'what is', 'basics', 'माहवारी', 'पीरियड'],
          path: '/boys'
        },
        {
          id: 'whyMiss',
          title: t('boys.whyMiss.title'),
          keywords: ['miss school', 'absent', 'symptoms', 'cramps', 'स्कूल', 'लक्षण'],
          path: '/boys'
        },
        {
          id: 'support',
          title: t('boys.support.title'),
          keywords: ['support', 'help', 'ally', 'friend', 'सहायता', 'मदद'],
          path: '/boys'
        },
        {
          id: 'myths',
          title: t('boys.myths.title'),
          keywords: ['myths', 'facts', 'misconceptions', 'मिथक', 'गलतफहमी'],
          path: '/boys'
        }
      ]
    },
    {
      page: 'parents',
      pageName: t('navigation.parents'),
      icon: 'BookOpen',
      color: 'green',
      sections: [
        {
          id: 'talking',
          title: t('parents.topics.talking'),
          keywords: ['talk', 'conversation', 'discuss', 'बातचीत', 'चर्चा'],
          path: '/parents'
        },
        {
          id: 'signs',
          title: t('parents.topics.signs'),
          keywords: ['puberty', 'signs', 'development', 'growth', 'संकेत', 'विकास'],
          path: '/parents'
        },
        {
          id: 'support',
          title: t('parents.topics.support'),
          keywords: ['support', 'emotional', 'help', 'सहायता', 'भावनात्मक'],
          path: '/parents'
        },
        {
          id: 'medical',
          title: t('parents.topics.medical'),
          keywords: ['doctor', 'medical', 'health', 'concern', 'डॉक्टर', 'चिकित्सा'],
          path: '/parents'
        },
        {
          id: 'resources',
          title: t('parents.topics.resources'),
          keywords: ['resources', 'books', 'websites', 'संसाधन', 'किताबें'],
          path: '/parents'
        }
      ]
    },
    {
      page: 'faq',
      pageName: t('navigation.faq'),
      icon: 'HelpCircle',
      color: 'purple',
      sections: [
        {
          id: 'basics',
          title: t('faq.categories.basics'),
          keywords: ['period', 'age', 'first time', 'normal', 'पीरियड', 'उम्र'],
          path: '/faq'
        },
        {
          id: 'health',
          title: t('faq.categories.health'),
          keywords: ['pain', 'cramps', 'heavy', 'irregular', 'दर्द', 'अनियमित'],
          path: '/faq'
        },
        {
          id: 'hygiene',
          title: t('faq.categories.hygiene'),
          keywords: ['pad', 'change', 'wash', 'clean', 'पैड', 'साफ'],
          path: '/faq'
        },
        {
          id: 'school',
          title: t('faq.categories.school'),
          keywords: ['school', 'sports', 'swimming', 'activities', 'स्कूल', 'खेल'],
          path: '/faq'
        },
        {
          id: 'emotions',
          title: t('faq.categories.emotions'),
          keywords: ['mood', 'feelings', 'emotions', 'pms', 'मूड', 'भावनाएं'],
          path: '/faq'
        },
        {
          id: 'myths',
          title: t('faq.categories.myths'),
          keywords: ['myths', 'taboos', 'beliefs', 'मिथक', 'वर्जनाएं'],
          path: '/faq'
        }
      ]
    }
  ];
};

export const searchGlobalContent = (query, t) => {
  if (!query || !query.trim()) return [];

  const contentIndex = getContentIndex(t);
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const results = [];

  contentIndex.forEach(page => {
    page.sections.forEach(section => {
      const searchableText = [
        section.title,
        ...section.keywords
      ].join(' ').toLowerCase();

      let score = 0;
      let matchCount = 0;

      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          matchCount++;
          const occurrences = (searchableText.match(new RegExp(term, 'g')) || []).length;
          score += occurrences;
        }
      });

      if (matchCount > 0) {
        results.push({
          ...section,
          page: page.page,
          pageName: page.pageName,
          icon: page.icon,
          color: page.color,
          score: score * (matchCount / searchTerms.length),
          relevance: matchCount / searchTerms.length
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score);
};
