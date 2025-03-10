const BASE_URLS = {
  dashboard: "/dashboard",
  home: "/home",
  clients: "/clients",
  company: "/company",
  dissolution: "/dissolution"
};

export const appRoute = {
  generic: {
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  admin: {
    login: "/login/admin",
    dashboard: BASE_URLS.dashboard,
    clients: BASE_URLS.dashboard + BASE_URLS.clients,
    company: BASE_URLS.dashboard + BASE_URLS.clients + BASE_URLS.company,
    users: BASE_URLS.dashboard + "/users",
    aiChatBot: BASE_URLS.dashboard + "/ai-chatbot",
    dissolution: BASE_URLS.dashboard + BASE_URLS.clients + BASE_URLS.dissolution 
  },

  clients: {
    login: "/login",
    register: "/register",
    registerProcess: "/register-process",
    registered: "/registered",
    authRedirection: "/auth/redirect",
    dashboard: BASE_URLS.home,
    dissolutionMap: BASE_URLS.home + "/dissolution",
    aiChatBot: BASE_URLS.home + "/ai-chatbot",
    docHub: BASE_URLS.home + "/doc-hub",
  },
} as const;
