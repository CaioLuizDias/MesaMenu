import { Product, Order, AttentionAlert } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Caipirinha de Limão",
    description: "Clássica caipirinha brasileira com cachaça artesanal, limão taiti fresco e açúcar orgânico.",
    category: "Bebidas",
    price: 28.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUDdqiCjN_X706wSMq_lj0lgPgcYkqbN3CJxuBEeIAjBRuOnSHzgSwU1_Lhpqq_oBoXmfiy6Tm8XdLo40taTeAd51DPSe9E6FrXtqA-s_3-AVF_xB8D2eris8iGjsR012NQ73fxtSsrIVtjuDLPmUQCRMCL59qHdguTDCPaveHInstD3q1XqlViAqb3rMl8sbzfgJkHNLc4jIUpH23_7K_yy8Zz889F1h0EfcZEhnHhB8nee37GqaoQp85R8WL5abaPBBvM42JkeRD",
    active: true
  },
  {
    id: "prod-2",
    name: "Chopp Artesanal",
    description: "Chopp Pilsen leve e refrescante, servido na caneca super gelada. 400ml.",
    category: "Bebidas",
    price: 16.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDANR0D6cmQF8Y3i9nMY1Sfr8PGX3SM-XPdgHbOdFJFDW1622VyJQ_V0Dh61S9Wnn0hgLFZdx8K9SGFOgyQUxbjkHgglGiCVSit1S1YfOUvDKYNEaLuXm8fs_LlNzYkdPzVY3gajb9pxZ5ukKXg3HlFLbj-82n-Jr_Oc1CCPMJNE9RhgiHJntNDUBnh2Q54jum6as7J3CdRJBnW8M9nL5fTW6jAIoCjXCb9Oa_gmMkQI3-hA-QkQGlrEpi2LLeswgvo7DevgiHWNVDZ",
    active: true
  },
  {
    id: "prod-3",
    name: "Água de Coco Natural",
    description: "Água de coco verde fresca, extraída na hora, sem conservantes.",
    category: "Bebidas",
    price: 12.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbqxNfQXhIyN32wMumiwphrXigSdEFYrXlQQnxHkcC8ysgGOlsAJgXIych_MZTSr2v0SYkrKzX_sIL8uNIUoSdGfz_loVSm0mNSvNN9EkcMyqNr-E2YnzlVY5WFh8CjfQEcffzyp22g_cN6-DM5B0YdlTW-Ho7ZA-n2NfHDdoFswaGCdYbMEVEMUIK6DEb1EmVgygB3f7NVauvDjiXvhJAtXjBUlXsckTtN0j_RDOYld7rEVJraDYY7kV1zl9_Y9wB1oesuS52WuCo",
    active: true
  },
  {
    id: "prod-4",
    name: "Citrus Spritz",
    description: "Drink refrescante de espumante, gin premium, fatias de toranja e alecrim fresco.",
    category: "Bebidas",
    price: 45.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi06k0LuqOtKLjeWcFXsmDhsC7j5Ch3ffywA8ebC3NTbKeE9_AE1bdCgwIFnWmybTXx5lfc9mdEZsxlp8mGyuH5642bn16VucA9RBOvHV20IpW7VMN2ELDfwxpLHj4XB0i2uxv4JglaFFzfYmc-A0aZnA60av3KXFGE_4KHVFcFZg6NM7qcrV59zi1Q-a15H8OOsgBqteHEWIFowGoHCZHMOf36M_vcLOqw0s4708O2_WUsGuaiSoF-ij0PUG9sBT_9Mh5XIhVVP1g",
    active: true
  },
  {
    id: "prod-5",
    name: "Rigatoni al Tartufo",
    description: "Massa artesanal rigatoni ao molho cremoso de trufas negras e parmesão gratinado.",
    category: "Pratos",
    price: 89.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuChMG8qesNP_v7jJSqkaU0c7AMUeR2PbJSFc-MkDQJHfXtJENX9RUObnFBPFxWbPGWxX8BcwS1DJEn9O5KJJ2wuAMrDee-ZrCYsfLKYqF_7jys5K_QzEfUEH5cQDWYZ5_LdPcbB_Ppy-0nR7FeyeDISLlttIfnU5p8ldDyVbIzz6TZZqGcONw594i3F5iEVqZOBM5AMfyfbZV9kFBdeAkZWa-eK1nzWiYwXgVluekaqZr-SUpIkBHeJbuB-TyUV2IPr_fOuM2O_mq",
    active: true
  },
  {
    id: "prod-6",
    name: "Salmão Grelhado ao Limão",
    description: "Acompanha risoto de alho-poró e aspargos salteados e redução de limão siciliano.",
    category: "Pratos",
    price: 98.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq6TR2eBNnfYgvNk8bav4ab2UrY9MeQ36tS5UaDx8pdsZwDo1SyIkkTe3qU2n0LZRIVhT3jk_KVoQm51E6IPO9iXYrsxUckLUgEhwQIazM8gIS7wXUAX6eC1EKHDW8fqDrb8Fq2dX5wHfmG8ctVoPlmyVtpH7ePt04Pdui4zo1LEL7puGWqAU3vivLUI0mamZmxYoXTmZMU9fevNWXuM5H4PeCXguvh3OCKzH4GXNDCom4Pk9wdOTinbY7Vxj5lw6D4zYwkuZ2wTAd",
    active: true
  },
  {
    id: "prod-7",
    name: "Carpaccio de Carne",
    description: "Lâminas finas, capilares de mostarda, alcaparras e queijo Grana Padano.",
    category: "Petiscos",
    price: 65.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9YumeH9UdIOHlY3h7mBXulMCqKowslSAL3BLlH5mLu3S1ezZ-rai10M8J9pWN1fjBaVAkXYHQ6iuU3a0D87GVdDcxWecLdB3BNlxrK7k0dzubhb6aIB-tJ2Cgn66n8M68Q78kxyLqRShsYlYTcs_hXLcKz2LYqDEg8XOBFmTsNGzv_31TiK_KnXY6kEmZ2vaeNoW4x38SswnNTDFmsq8PkbjqVaykfLqtHJ-cxLpV-ia1NxNJaRdTtO6H9_rFmjfsMFd2F6zSkTCf",
    active: false
  },
  {
    id: "prod-8",
    name: "Tiramisu Clássico",
    description: "Receita tradicional italiana com mascarpone fresco e licor Amaretto.",
    category: "Sobremesas",
    price: 35.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzo9822HCWfN0l5ZXb48-CLpr9MYxgPafaHRdzNyOgYD0dM_HAyh6y3B8QfaYXIGQPSmJJU4dRUVShSjXA5Otyw2hU2YhqGj0pYgqU7qp9PhDCzHOwZ_ZfSGLUlznIy-Fz_T1-PRar6211eNaP7JW6sqSrSG3FyI9IAh96Yd-R1Ve2EFHvCTA6qHNAOYxwPwlDYwptvzHG8KjsoYdPxwYv31M87bOVgElvh9ZNHTEc05xW0nmH1v7Ah-Hu048bhkK1uWj9qUiojvLp",
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "#4092",
    table: "Mesa 12",
    timestamp: "20/05 15:10",
    elapsedMinutes: 4,
    items: [
      { productName: "Ceviche Clássico", quantity: 2, price: 68.00, notes: "Sem cebola roxa", category: "Petiscos" },
      { productName: "Risoto de Frutos do Mar", quantity: 1, price: 89.00, category: "Pratos" },
      { productName: "Moscow Mule", quantity: 3, price: 38.00, category: "Bebidas" }
    ],
    status: "Novo",
    sector: "Cozinha",
    warningTime: false
  },
  {
    id: "#4089",
    table: "Mesa 08",
    timestamp: "20/05 14:58",
    elapsedMinutes: 18,
    items: [
      { productName: "Moqueca Baiana (2 pessoas)", quantity: 1, price: 180.00, category: "Pratos" },
      { productName: "Caipirinha de Limão", quantity: 2, price: 28.00, category: "Bebidas" }
    ],
    status: "Em Preparo",
    sector: "Cozinha",
    warningTime: true,
    clientDemoradaMessage: "Cliente reclamou da demora"
  },
  {
    id: "#4094",
    table: "Balcão B2",
    timestamp: "20/05 15:15",
    elapsedMinutes: 2,
    items: [
      { productName: "Tartare de Salmão", quantity: 1, price: 65.00, category: "Petiscos" },
      { productName: "Polvo Grelhado", quantity: 1, price: 110.00, notes: "Acompanha batatas ao murro", category: "Pratos" }
    ],
    status: "Em Preparo",
    sector: "Cozinha",
    warningTime: false
  }
];

export const INITIAL_ALERTS: AttentionAlert[] = [
  {
    id: "alert-1",
    type: "warning",
    title: "Mesa 03 aguardando conta",
    description: "Cliente solicitou o fechamento da conta há 5 min.",
    time: "5 min"
  },
  {
    id: "alert-2",
    type: "inventory",
    title: "Estoque Baixo: Gin Bombay",
    description: "Gin Bombay Sapphire possui apenas 2 garrafas restantes no estoque do bar.",
    time: "Agora"
  }
];

export const REVENUE_HISTORY = [
  { day: "Seg", value: 3400 },
  { day: "Ter", value: 4100 },
  { day: "Qua", value: 3900 },
  { day: "Qui", value: 5200 },
  { day: "Sex", value: 7800 },
  { day: "Sáb", value: 9200 },
  { day: "Dom", value: 8900 }
];

export const TOP_SELLING_ITEMS = [
  { name: "Risoto de Frutos do Mar", count: 42, percentage: 100 },
  { name: "Ceviche Clássico", count: 38, percentage: 85 },
  { name: "Moqueca Baiana", count: 29, percentage: 65 },
  { name: "Drink Gin Tônica", count: 55, percentage: 50 },
  { name: "Sobremesa Tiramisu", count: 18, percentage: 30 }
];
