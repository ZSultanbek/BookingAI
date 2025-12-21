export type Language = 'en' | 'ru' | 'kk';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    close: string;
    viewDetails: string;
    perNight: string;
  };
  
  // Navigation
  nav: {
    home: string;
    search: string;
    destinations: string;
    favorites: string;
    aiAssistant: string;
    manageProperties: string;
    preferences: string;
  };

  // Auth
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    accountType: string;
    guest: string;
    host: string;
    welcomeBack: string;
    signIn: string;
    createAccount: string;
    alreadyHaveAccount: string;
    needAccount: string;
    signInHere: string;
    createOne: string;
    passwordMismatch: string;
    fillRequired: string;
    registrationSuccess: string;
    loginSuccess: string;
    invalidCredentials: string;
  };

  // Preferences
  preferences: {
    title: string;
    subtitle: string;
    language: string;
    selectLanguage: string;
    english: string;
    russian: string;
    kazakh: string;
    budget: string;
    priceRange: string;
    travelPurpose: string;
    travelPurposes: {
      leisureTitle: string;
      leisureDesc: string;
      businessTitle: string;
      businessDesc: string;
      familyTitle: string;
      familyDesc: string;
      adventureTitle: string;
      adventureDesc: string;
    };
    wherePreferStay: string;
    selectAmenities: string;
    locationPreference: string;
    amenities: string;
    roomTypes: string;
    savePreferences: string;
    preferencesSaved: string;
    preferenceSummary: string;
    tipsHeading: string;
    tips: string[];
  };

  // Host Properties
  hostProperties: {
    title: string;
    subtitle: string;
    addProperty: string;
    editProperty: string;
    createProperty: string;
    propertyName: string;
    location: string;
    description: string;
    pricePerNight: string;
    rooms: string;
    addRoom: string;
    editRoom: string;
    createRoom: string;
    roomTitle: string;
    availabilityStatus: string;
    available: string;
    booked: string;
    unavailable: string;
    photoUrl: string;
    noProperties: string;
    createFirstProperty: string;
    noRooms: string;
    addFirstRoom: string;
  };

  // Home
  home: {
    title: string;
    subtitle: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    searchHotels: string;
    aiRecommendations: string;
    aiRecommendationsSubtitle: string;
    whereTo: string;
    viewAll: string;
    noAIRecommendations: string;
    noHotelsAvailable: string;
    trendingSubtitle: string;
    features: {
      aiPoweredMatchingTitle: string;
      aiPoweredMatchingDesc: string;
      smartSearchTitle: string;
      smartSearchDesc: string;
      bestPricesTitle: string;
      bestPricesDesc: string;
    };
    trendingDestinations: string;
  };
  // Search
  search: {
    allHotels: string;
    propertiesFound: string; // use {count} placeholder
    aiRecommended: string;
    filters: string;
    priceRange: string;
    amenities: string;
    viewDetails: string;
    clearFilters: string;
    sorts: {
      aiRecommended: string;
      priceLow: string;
      priceHigh: string;
      highestRated: string;
      recentlyAdded: string;
      name: string;
    };
  };

  // Destinations
  destinations: {
    exploreTitle: string;
    exploreSubtitle: string;
    searchPlaceholder: string;
    trendingTitle: string;
    trendingSubtitle: string;
    browseByCategory: string;
    category: {
      beach: string;
      city: string;
      mountain: string;
      cultural: string;
    };
    destinationsCount: string; // '{count} destinations'
    needHelpTitle: string;
    needHelpDesc: string;
    chatButton: string;
    avgPriceLabel: string;
    hotelsLabel: string;
    bestTimeLabel: string;
    exploreHotels: string;
  };

  // Favorites
  favorites: {
    title: string;
    savedCount: string; // '{count} hotels saved for later'
    noFavoritesTitle: string;
    noFavoritesDesc: string;
    browseHotels: string;
    viewAIRecommendations: string;
    loading: string;
    sortByLabel: string;
    compareFavorites: string;
  };

  // AI Chat
  aiChat: {
    title: string;
    onlineStatus: string;
    suggestedQuestions: string;
    initialMessage: string;
    viewAIRecommendations: string;
    viewPersonalizedPicks: string;
    exploreDestinations: string;
    browsePopularPlaces: string;
    updatePreferences: string;
    improveRecommendations: string;
    inputPlaceholder: string;
    secureHistory: string;
    clearHistory: string;
    poweredBy: string;
  };

  // Hotel specific
  hotel: {
    greatMatch: string;
    moreCount: string; // '+{count} more'
  };
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      close: 'Close',
      viewDetails: 'View Details',
      perNight: 'night',
    },
    nav: {
      home: 'Home',
      search: 'Search',
      destinations: 'Destinations',
      favorites: 'Favorites',
      aiAssistant: 'AI Assistant',
      manageProperties: 'Manage Properties',
      preferences: 'Preferences',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      accountType: 'Account Type',
      guest: 'Guest',
      host: 'Host',
      welcomeBack: 'Welcome back',
      signIn: 'Sign in',
      createAccount: 'Create account',
      alreadyHaveAccount: 'Already have an account?',
      needAccount: 'Need an account?',
      signInHere: 'Sign in',
      createOne: 'Create one',
      passwordMismatch: 'Passwords do not match.',
      fillRequired: 'Please fill in all required fields.',
      registrationSuccess: 'Account created successfully!',
      loginSuccess: 'Welcome back!',
      invalidCredentials: 'Invalid email or password.'
    },
    preferences: {
      title: 'Your Preferences',
      subtitle: 'Customize your experience to get better AI recommendations',
      language: 'Language',
      selectLanguage: 'Select Language',
      english: 'English',
      russian: 'Russian',
      kazakh: 'Kazakh',
      budget: 'Budget',
      priceRange: 'Preferred price range per night',
      travelPurpose: 'Travel Purpose',
      travelPurposes: {
        leisureTitle: 'Leisure & Vacation',
        leisureDesc: 'Relaxation and enjoyment',
        businessTitle: 'Business Travel',
        businessDesc: 'Work-related trips',
        familyTitle: 'Family Vacation',
        familyDesc: 'Traveling with family',
        adventureTitle: 'Adventure & Exploration',
        adventureDesc: 'Outdoor activities and discovery',
      },
      wherePreferStay: 'Where do you prefer to stay?',
      selectAmenities: 'Select all amenities that are important to you',
      locationPreference: 'Location Preference',
      amenities: 'Preferred Amenities',
      roomTypes: 'Room Type Preferences',
      savePreferences: 'Save Preferences',
      preferencesSaved: 'Preferences saved successfully!',
      preferenceSummary: 'Your Preference Summary',
      tipsHeading: 'Tips for Better Recommendations',
      tips: [
        'Update your preferences regularly to reflect your changing needs',
        'The more specific you are, the better our AI can match you with hotels',
        "Like hotels you're interested in to help train the AI",
        'Your preferences are only stored in your browser for privacy',
      ],
    },
    hostProperties: {
      title: 'Manage Properties',
      subtitle: 'Create and manage your hotels and rooms',
      addProperty: 'Add Property',
      editProperty: 'Edit Property',
      createProperty: 'Create New Property',
      propertyName: 'Property Name',
      location: 'Location',
      description: 'Description',
      pricePerNight: 'Price per Night',
      rooms: 'Rooms',
      addRoom: 'Add Room',
      editRoom: 'Edit Room',
      createRoom: 'Create New Room',
      roomTitle: 'Room Title',
      availabilityStatus: 'Availability Status',
      available: 'Available',
      booked: 'Booked',
      unavailable: 'Unavailable',
      photoUrl: 'Photo URL',
      noProperties: 'No properties yet',
      createFirstProperty: 'Create Your First Property',
      noRooms: 'No rooms yet. Add your first room!',
      addFirstRoom: 'Add Room',
    },
    home: {
      title: 'Find Your Perfect Stay with AI',
      subtitle: 'Personalized hotel recommendations powered by artificial intelligence',
      destination: 'Destination',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      searchHotels: 'Search Hotels',
      aiRecommendations: 'AI Recommendations for You',
      aiRecommendationsSubtitle: 'Personalized picks based on your preferences',
      whereTo: 'Where to?',
      viewAll: 'View All',
      noAIRecommendations: 'No AI recommendations available yet.',
      noHotelsAvailable: 'No hotels available.',
      trendingSubtitle: 'Most popular places this month',
      features: {
        aiPoweredMatchingTitle: 'AI-Powered Matching',
        aiPoweredMatchingDesc: 'Our AI learns your preferences to suggest the perfect hotels for you',
        smartSearchTitle: 'Smart Search',
        smartSearchDesc: 'Advanced filters and AI recommendations make finding hotels effortless',
        bestPricesTitle: 'Best Prices',
        bestPricesDesc: 'AI analyzes millions of prices to ensure you get the best deal',
      },
      trendingDestinations: 'Trending Destinations',
    },
    search: {
      allHotels: 'All Hotels',
      propertiesFound: '{count} properties found',
      aiRecommended: 'AI Recommended',
      filters: 'Filters',
      priceRange: 'Price Range',
      amenities: 'Amenities',
      viewDetails: 'View Details',
      clearFilters: 'Clear Filters',
      sorts: {
        aiRecommended: 'AI Recommended',
        priceLow: 'Price: Low to High',
        priceHigh: 'Price: High to Low',
        highestRated: 'Highest Rated',
        recentlyAdded: 'Recently Added',
        name: 'Name (A-Z)'
      },
    },
    destinations: {
      exploreTitle: 'Explore Destinations',
      exploreSubtitle: 'Discover your next adventure with AI-powered destination recommendations',
      searchPlaceholder: 'Search destinations...',
      trendingTitle: 'Trending Destinations',
      trendingSubtitle: 'Most popular places this month',
      browseByCategory: 'Browse by Category',
      category: {
        beach: 'Beach Destinations',
        city: 'City Breaks',
        mountain: 'Mountain Retreats',
        cultural: 'Cultural Hubs',
      },
      destinationsCount: '{count} destinations',
      needHelpTitle: 'Need Help Choosing?',
      needHelpDesc: 'Let our AI assistant suggest the perfect destination for you',
      chatButton: 'Chat with AI Assistant',
      avgPriceLabel: 'Avg. Price',
      hotelsLabel: 'Hotels',
      bestTimeLabel: 'Best time:',
      exploreHotels: 'Explore Hotels',
    },
    favorites: {
      title: 'Your Favorites',
      savedCount: '{count} hotels saved for later',
      noFavoritesTitle: 'No favorites yet',
      noFavoritesDesc: 'Start exploring and save hotels you love by clicking the heart icon. Your favorites will help our AI better understand your preferences.',
      browseHotels: 'Browse Hotels',
      viewAIRecommendations: 'View AI Recommendations',
      loading: 'Loading favorites...',
      sortByLabel: 'Sort by:',
      compareFavorites: 'Compare Your Favorites',
    },
    aiChat: {
      title: 'AI Travel Assistant',
      onlineStatus: 'Online and ready to help',
      initialMessage: "Hi! I'm your AI travel assistant. I can help you find the perfect hotel, plan your trip, or answer any questions about destinations. How can I assist you today?",
      suggestedQuestions: 'Suggested questions:',
      viewAIRecommendations: 'View AI Recommendations',
      viewPersonalizedPicks: 'See personalized hotel picks',
      exploreDestinations: 'Explore Destinations',
      browsePopularPlaces: 'Browse popular places',
      updatePreferences: 'Update Preferences',
      improveRecommendations: 'Improve recommendations',
      inputPlaceholder: 'Ask me anything about hotels or travel...',
      secureHistory: 'Secure History',
      clearHistory: 'Clear History',
      poweredBy: 'Powered by Gemini AI',
    },
    hotel: {
      greatMatch: 'Great match based on your preferences',
      moreCount: '+{count} more',
    },
  },
  ru: {
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      create: 'Создать',
      update: 'Обновить',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      confirm: 'Подтвердить',
      close: 'Закрыть',
      viewDetails: 'Просмотреть детали',
      perNight: 'ночь',
    },
    nav: {
      home: 'Главная',
      search: 'Поиск',
      destinations: 'Направления',
      favorites: 'Избранное',
      aiAssistant: 'AI Помощник',
      manageProperties: 'Управление объектами',
      preferences: 'Настройки',
    },
    auth: {
      login: 'Вход',
      register: 'Регистрация',
      logout: 'Выйти',
      email: 'Email',
      password: 'Пароль',
      name: 'Имя',
      confirmPassword: 'Подтвердите пароль',
      accountType: 'Тип аккаунта',
      guest: 'Гость',
      host: 'Хозяин',
      welcomeBack: 'Добро пожаловать',
      signIn: 'Войти',
      createAccount: 'Создать аккаунт',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      needAccount: 'Нужен аккаунт?',
      signInHere: 'Войти',
      createOne: 'Создать',
      passwordMismatch: 'Пароли не совпадают.',
      fillRequired: 'Пожалуйста, заполните все обязательные поля.',
      registrationSuccess: 'Аккаунт успешно создан!',
      loginSuccess: 'С возвращением!',
      invalidCredentials: 'Неверный email или пароль.'
    },
    preferences: {
      title: 'Ваши настройки',
      subtitle: 'Настройте свой опыт для лучших AI рекомендаций',
      language: 'Язык',
      selectLanguage: 'Выберите язык',
      english: 'Английский',
      russian: 'Русский',
      kazakh: 'Казахский',
      budget: 'Бюджет',
      priceRange: 'Предпочитаемый диапазон цен за ночь',
      travelPurpose: 'Цель поездки',
      travelPurposes: {
        leisureTitle: 'Отдых и каникулы',
        leisureDesc: 'Расслабление и отдых',
        businessTitle: 'Деловая поездка',
        businessDesc: 'Поездки по работе',
        familyTitle: 'Семейный отдых',
        familyDesc: 'Путешествие с семьёй',
        adventureTitle: 'Приключения и исследования',
        adventureDesc: 'Активный отдых и открытие нового',
      },
      wherePreferStay: 'Где вы предпочитаете останавливаться?',
      selectAmenities: 'Выберите все удобства, которые для вас важны',
      locationPreference: 'Предпочтения по местоположению',
      amenities: 'Предпочитаемые удобства',
      roomTypes: 'Предпочтения по типу комнаты',
      savePreferences: 'Сохранить настройки',
      preferencesSaved: 'Настройки успешно сохранены!',
      preferenceSummary: 'Сводка ваших предпочтений',
      tipsHeading: 'Советы для лучших рекомендаций',
      tips: [
        'Обновляйте свои настройки регулярно, чтобы они отражали ваши текущие потребности',
        'Чем конкретнее вы, тем лучше наш AI сможет подобрать отели',
        'Отмечайте понравившиеся отели, чтобы помочь обучению AI',
        'Ваши настройки хранятся только в браузере для конфиденциальности',
      ],
    },
    hostProperties: {
      title: 'Управление объектами',
      subtitle: 'Создавайте и управляйте своими отелями и номерами',
      addProperty: 'Добавить объект',
      editProperty: 'Редактировать объект',
      createProperty: 'Создать новый объект',
      propertyName: 'Название объекта',
      location: 'Местоположение',
      description: 'Описание',
      pricePerNight: 'Цена за ночь',
      rooms: 'Номера',
      addRoom: 'Добавить номер',
      editRoom: 'Редактировать номер',
      createRoom: 'Создать новый номер',
      roomTitle: 'Название номера',
      availabilityStatus: 'Статус доступности',
      available: 'Доступен',
      booked: 'Забронирован',
      unavailable: 'Недоступен',
      photoUrl: 'URL фото',
      noProperties: 'Пока нет объектов',
      createFirstProperty: 'Создайте свой первый объект',
      noRooms: 'Пока нет номеров. Добавьте первый номер!',
      addFirstRoom: 'Добавить номер',
    },
    home: {
      title: 'Найдите идеальное жилье с AI',
      subtitle: 'Персонализированные рекомендации отелей на основе искусственного интеллекта',
      destination: 'Направление',
      checkIn: 'Заезд',
      checkOut: 'Выезд',
      guests: 'Гости',
      searchHotels: 'Поиск отелей',
      aiRecommendations: 'AI Рекомендации для вас',
      aiRecommendationsSubtitle: 'Персонализированные подборки на основе ваших предпочтений',
      whereTo: 'Куда?',
      viewAll: 'Просмотреть все',
      noAIRecommendations: 'Пока нет AI рекомендаций.',
      noHotelsAvailable: 'Нет доступных отелей.',
      trendingSubtitle: 'Самые популярные места в этом месяце',
      features: {
        aiPoweredMatchingTitle: 'AI-подбор',
        aiPoweredMatchingDesc: 'Наш AI изучает ваши предпочтения, чтобы предложить идеальные отели для вас',
        smartSearchTitle: 'Умный поиск',
        smartSearchDesc: 'Расширенные фильтры и AI рекомендации упрощают поиск отелей',
        bestPricesTitle: 'Лучшие цены',
        bestPricesDesc: 'AI анализирует миллионы цен, чтобы вы получили лучшую сделку',
      },
      trendingDestinations: 'Популярные направления',
    },
    search: {
      allHotels: 'Все отели',
      propertiesFound: '{count} объектов найдено',
      aiRecommended: 'AI Рекомендуемые',
      filters: 'Фильтры',
      priceRange: 'Диапазон цен',
      amenities: 'Удобства',
      viewDetails: 'Просмотреть детали',
      clearFilters: 'Сбросить фильтры',
      sorts: {
        aiRecommended: 'AI Рекомендуемые',
        priceLow: 'Цена: по возрастанию',
        priceHigh: 'Цена: по убыванию',
        highestRated: 'С наивысшим рейтингом',
        recentlyAdded: 'Недавно добавленные',
        name: 'Имя (A-Я)'
      },
    },
    destinations: {
      exploreTitle: 'Изучите направления',
      exploreSubtitle: 'Откройте для себя новое приключение с рекомендациями направлений на базе AI',
      searchPlaceholder: 'Поиск направлений...',
      trendingTitle: 'Популярные направления',
      trendingSubtitle: 'Самые популярные места в этом месяце',
      browseByCategory: 'Просмотр по категориям',
      category: {
        beach: 'Пляжные направления',
        city: 'Городские поездки',
        mountain: 'Горные ретриты',
        cultural: 'Культурные центры',
      },
      destinationsCount: '{count} направлений',
      needHelpTitle: 'Нужна помощь с выбором?',
      needHelpDesc: 'Пусть наш AI помощник предложит идеальное направление для вас',
      chatButton: 'Чат с AI помощником',
      avgPriceLabel: 'Средняя цена',
      hotelsLabel: 'Отели',
      bestTimeLabel: 'Лучшее время:',
      exploreHotels: 'Ознакомиться с отелями',
    },
    favorites: {
      title: 'Избранное',
      savedCount: '{count} отелей сохранено',
      noFavoritesTitle: 'Пока нет избранного',
      noFavoritesDesc: 'Начните исследовать и сохраняйте отели, которые вам нравятся, нажимая на значок сердца. Ваше избранное поможет AI лучше понимать ваши предпочтения.',
      browseHotels: 'Просмотреть отели',
      viewAIRecommendations: 'Посмотреть AI рекомендации',
      loading: 'Загрузка избранного...',
      sortByLabel: 'Сортировать по:',
      compareFavorites: 'Сравнить избранное',
    },
    aiChat: {
      title: 'AI Путешественный помощник',
      onlineStatus: 'Онлайн и готов помочь',
      initialMessage: 'Привет! Я ваш AI помощник по путешествиям. Я могу помочь найти идеальный отель, спланировать поездку или ответить на вопросы о направлениях. Чем могу помочь?',
      suggestedQuestions: 'Предложенные вопросы:',
      viewAIRecommendations: 'Посмотреть AI рекомендации',
      viewPersonalizedPicks: 'Посмотреть персонализированные подборки',
      exploreDestinations: 'Изучить направления',
      browsePopularPlaces: 'Просмотреть популярные места',
      updatePreferences: 'Обновить настройки',
      improveRecommendations: 'Улучшить рекомендации',
      inputPlaceholder: 'Спросите меня о чем угодно по отелям или путешествиям...',
      secureHistory: 'Защитить историю',
      clearHistory: 'Очистить историю',
      poweredBy: 'Работает на Gemini AI',
    },
    hotel: {
      greatMatch: 'Отличное соответствие вашим предпочтениям',
      moreCount: '+{count} ещё',
    },
  },
  kk: {
    common: {
      save: 'Сақтау',
      cancel: 'Болдырмау',
      delete: 'Жою',
      edit: 'Өңдеу',
      create: 'Жасау',
      update: 'Жаңарту',
      loading: 'Жүктелуде...',
      error: 'Қате',
      success: 'Сәтті',
      confirm: 'Растау',
      close: 'Жабу',
      viewDetails: 'Толығырақ',
      perNight: 'түн',
    },
    nav: {
      home: 'Басты',
      search: 'Іздеу',
      destinations: 'Баратын жерлер',
      favorites: 'Таңдаулылар',
      aiAssistant: 'AI Көмекші',
      manageProperties: 'Объектілерді басқару',
      preferences: 'Баптаулар',
    },
    auth: {
      login: 'Кіру',
      register: 'Тіркелу',
      logout: 'Шығу',
      email: 'Email',
      password: 'Құпия сөз',
      name: 'Аты',
      confirmPassword: 'Құпия сөзді растау',
      accountType: 'Есептік жазба түрі',
      guest: 'Қонақ',
      host: 'Ие',
      welcomeBack: 'Қош келдіңіз',
      signIn: 'Кіру',
      createAccount: 'Есептік жазба жасау',
      alreadyHaveAccount: 'Есептік жазба бар ма?',
      needAccount: 'Есептік жазба керек пе?',
      signInHere: 'Кіру',
      createOne: 'Жасау',
      passwordMismatch: 'Құпия сөздер сәйкес келмейді.',
      fillRequired: 'Барлық міндетті өрістерді толтырыңыз.',
      registrationSuccess: 'Тіркелгі сәтті құрылды!',
      loginSuccess: 'Қайта қош келдіңіз!',
      invalidCredentials: 'Қате электрондық пошта немесе құпия сөз.'
    },
    preferences: {
      title: 'Сіздің баптауларыңыз',
      subtitle: 'AI ұсыныстарын жақсарту үшін тәжірибені теңшеңіз',
      language: 'Тіл',
      selectLanguage: 'Тілді таңдаңыз',
      english: 'Ағылшын',
      russian: 'Орыс',
      kazakh: 'Қазақ',
      budget: 'Бюджет',
      priceRange: 'Түндегі баға диапазоны',
      travelPurpose: 'Саяхат мақсаты',
      travelPurposes: {
        leisureTitle: 'Демалыс және каникул',
        leisureDesc: 'Демалу және рахаттану',
        businessTitle: 'Іскерлік сапар',
        businessDesc: 'Жұмысқа байланысты сапарлар',
        familyTitle: 'Отбасылық демалыс',
        familyDesc: 'Отбасымен бірге сапар',
        adventureTitle: 'Оқиға мен зерттеу',
        adventureDesc: 'Сырттағы әрекеттер мен ашулар',
      },
      wherePreferStay: 'Қайда тұруды қалайдысыз?',
      selectAmenities: 'Сіздің үшін маңызды ыңғайлылықтарды таңдаңыз',
      locationPreference: 'Орналасу баптаулары',
      amenities: 'Ұсынылатын ыңғайлылықтар',
      roomTypes: 'Бөлме түрі баптаулары',
      savePreferences: 'Баптауларды сақтау',
      preferencesSaved: 'Баптаулар сәтті сақталды!',
      preferenceSummary: 'Сіздің баптауларыңыздың қысқаша мазмұны',
      tipsHeading: 'Жақсы ұсыныстарға арналған кеңестер',
      tips: [
        'Өзгерістерге сәйкес баптауларыңызды үнемі жаңартыңыз',
        'Неғұрлым нақты болсаңыз, AI соғұрлым жақсы қарай таңдайды',
        'AI-ды оқытуға көмектесу үшін ұнаған қонақүйлерді белгілеп қойыңыз',
        'Сіздің баптауларыңыз құпиялылық үшін тек браузерде сақталады',
      ],
    },
    hostProperties: {
      title: 'Объектілерді басқару',
      subtitle: 'Қонақ үйлер мен бөлмелерді жасаңыз және басқарыңыз',
      addProperty: 'Объекті қосу',
      editProperty: 'Объектіні өңдеу',
      createProperty: 'Жаңа объекті жасау',
      propertyName: 'Объекті атауы',
      location: 'Орналасуы',
      description: 'Сипаттама',
      pricePerNight: 'Түндегі баға',
      rooms: 'Бөлмелер',
      addRoom: 'Бөлме қосу',
      editRoom: 'Бөлмені өңдеу',
      createRoom: 'Жаңа бөлме жасау',
      roomTitle: 'Бөлме атауы',
      availabilityStatus: 'Қолжетімділік мәртебесі',
      available: 'Қолжетімді',
      booked: 'Брондалған',
      unavailable: 'Қолжетімсіз',
      photoUrl: 'Фото URL',
      noProperties: 'Әлі объектілер жоқ',
      createFirstProperty: 'Алғашқы объектіңізді жасаңыз',
      noRooms: 'Әлі бөлмелер жоқ. Алғашқы бөлмені қосыңыз!',
      addFirstRoom: 'Бөлме қосу',
    },
    home: {
      title: 'AI арқылы мінсіз тұру орнын табыңыз',
      subtitle: 'Жасанды интеллект негізіндегі жеке қонақ үй ұсыныстары',
      destination: 'Баратын жер',
      checkIn: 'Кіру',
      checkOut: 'Шығу',
      guests: 'Қонақтар',
      searchHotels: 'Қонақ үйлерді іздеу',
      aiRecommendations: 'Сізге арналған AI ұсыныстары',
      aiRecommendationsSubtitle: 'Сіздің таңдауларыңызға негізделген жеке таңдаулар',
      whereTo: 'Қайда?',
      viewAll: 'Барлығын көру',
      noAIRecommendations: 'Әлі AI ұсыныстары жоқ.',
      noHotelsAvailable: 'Қонақ үйлер табылған жоқ.',
      trendingSubtitle: 'Осы айдағы танымал орындар',
      features: {
        aiPoweredMatchingTitle: 'AI арқылы үйлесім',
        aiPoweredMatchingDesc: 'AI сіздің таңдауларыңызды үйреніп, сізге арналған мінсіз қонақүйлерді ұсынады',
        smartSearchTitle: 'Ақылды іздеу',
        smartSearchDesc: 'Кеңейтілген сүзгілер мен AI ұсыныстары қонақ үйлерді табуды жеңілдетеді',
        bestPricesTitle: 'Үздік бағалар',
        bestPricesDesc: 'AI миллиондаған бағаларды талдап, сізге ең жақсы ұсынысты қамтамасыз етеді',
      },
      trendingDestinations: 'Танымал бағыттар',
    },
    search: {
      allHotels: 'Барлық қонақүйлер',
      propertiesFound: '{count} орын табылды',
      aiRecommended: 'AI ұсынғандар',
      filters: 'Сүзгілер',
      priceRange: 'Баға диапазоны',
      amenities: 'Ыңғайлылықтар',
      viewDetails: 'Толық ақпарат',
      clearFilters: 'Сүзгілерді тазалау',
      sorts: {
        aiRecommended: 'AI ұсынылған',
        priceLow: 'Баға: өсу тәртібі',
        priceHigh: 'Баға: кему тәртібі',
        highestRated: 'Ең жоғары рейтинг',
        recentlyAdded: 'Жақында қосылғандар',
        name: 'Аты (A-Я)'
      },
    },
    destinations: {
      exploreTitle: 'Баратын жерлерді зерттеу',
      exploreSubtitle: 'AI-негізіндегі бағыт ұсыныстарымен өзіңіздің келесі саяхатыңызды табыңыз',
      searchPlaceholder: 'Баратын жерлерді іздеу...',
      trendingTitle: 'Танымал бағыттар',
      trendingSubtitle: 'Осы айдағы ең танымал орындар',
      browseByCategory: 'Санат бойынша шолу',
      category: {
        beach: 'Пляж бағыттары',
        city: 'Қалалық демалыс',
        mountain: 'Таулы демалыстар',
        cultural: 'Мәдени орталықтар',
      },
      destinationsCount: '{count} бағыттар',
      needHelpTitle: 'Таңдауға көмек керек пе?',
      needHelpDesc: 'AI көмекшіміз сізге ең жақсы бағытты ұсынсын',
      chatButton: 'AI көмегімен сөйлесу',
      avgPriceLabel: 'Орташа баға',
      hotelsLabel: 'Қонақүйлер',
      bestTimeLabel: 'Ең жақсы уақыт:',
      exploreHotels: 'Қонақүйлерді қарау',
    },
    favorites: {
      title: 'Таңдаулылар',
      savedCount: '{count} қонақ үй кейін сақталды',
      noFavoritesTitle: 'Әлі таңдаулылар жоқ',
      noFavoritesDesc: 'Жүріп көріңіз және жүрегіңіздегі белгішені басып ұнайтын қонақүйлерді сақтаңыз. Сіздің таңдаулыларыңыз AI-ға сіздің таңдауларыңызды жақсы түсінуге көмектеседі.',
      browseHotels: 'Қонақүйлерді шолу',
      viewAIRecommendations: 'AI ұсыныстарын қарау',
      loading: 'Таңдаулылар жүктелуде...',
      sortByLabel: 'Сұрыптау бойынша:',
      compareFavorites: 'Таңдаулыларыңызды салыстыру',
    },
    aiChat: {
      title: 'AI Саяхат көмекшісі',
      onlineStatus: 'Онлайн және көмектесуге дайын',
      initialMessage: 'Сәлем! Мен сіздің AI саяхат көмекшісімін. Мен сізге идеалды қонақүйді табуға, сапарыңызды жоспарлауға немесе бағыттар туралы сұрақтарға жауап беруге көмектесе аламын. Қалай көмектесе аламын?',
      suggestedQuestions: 'Ұсынылған сұрақтар:',
      viewAIRecommendations: 'AI ұсыныстарын қарау',
      viewPersonalizedPicks: 'Жеке таңдалғандарды қарау',
      exploreDestinations: 'Баратын жерлерді зерттеу',
      browsePopularPlaces: 'Танымал орындарды шолу',
      updatePreferences: 'Баптауларды жаңарту',
      improveRecommendations: 'Ұсыныстарды жақсарту',
      inputPlaceholder: 'Қонақүйлер немесе саяхат туралы кез келген нәрсені сұраңыз...',
      secureHistory: 'Тарихты қорғау',
      clearHistory: 'Тарихты тазалау',
      poweredBy: 'Gemini AI арқылы жұмыс істейді',
    },
    hotel: {
      greatMatch: 'Сіздің таңдауларыңызға сай тамаша сәйкес келеді',
      moreCount: '+{count} тағы',
    },
  },
};

export default translations;
