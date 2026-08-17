export const hackathonPhotos = Array.from({ length: 11 }, (_, i) => {
  const n = i + 1
  return {
    id: `foto${n}`,
    base: `/media/gallery/hackathons/foto${n}`,
    width: 1080,
    height: 1080,
    alt: `Equipe da LAMIT em um hackathon (foto ${n} de 11)`,
  }
})

export const events = [
  {
    id: 'onboarding-lamit',
    title: 'Onboarding LAMIT',
    date: '11 de abril de 2026',
    role: 'Organização',
    description:
      'Evento de abertura da LAMIT, reunindo mais de 180 pessoas para conhecer a liga e suas frentes de atuação.',
    photo: {
      base: '/media/gallery/eventos/eventoOnboarding',
      width: 1280,
      height: 854,
      alt: 'Público reunido no Onboarding LAMIT 2026',
    },
    reverse: false,
  },
  {
    id: 'gdg-build-with-ai',
    title: 'GDG Build With AI',
    date: '9 de maio de 2026',
    role: 'Colaboração',
    description:
      'Mais de 160 pessoas de público pagante e diversas trilhas sobre inteligência artificial, a LAMIT atuou como colaboradora do evento.',
    photo: {
      base: '/media/gallery/eventos/eventoGDG',
      width: 1600,
      height: 901,
      alt: 'Equipe da LAMIT no evento GDG Build With AI',
    },
    reverse: true,
  },
  {
    id: 'amo-o-que-faco-ucsal',
    title: 'Amo o que Faço UCSAL',
    date: '15 de maio de 2026',
    role: 'Parceria e cobertura',
    description:
      'Cerca de 100 estudantes da UCSAL discutindo o futuro do mercado de trabalho, em parceria com a Scupp Ventures. A LAMIT apoiou a divulgação e a cobertura do evento.',
    photo: {
      base: '/media/gallery/eventos/eventoUcsal',
      width: 1600,
      height: 901,
      alt: 'Auditório da UCSAL durante o evento Amo o que Faço',
    },
    reverse: false,
  },
  {
    id: 'imersao-lamit',
    title: 'Imersão LAMIT',
    date: '11 de julho de 2026',
    role: 'Organização',
    description:
      'Trilhas sobre Web3, LinkedIn e carreira, gestão de projetos e agentes de IA, reunindo mais de 150 pessoas em um evento realizado pela própria LAMIT.',
    photo: {
      base: '/media/gallery/eventos/eventoImersao2',
      width: 1600,
      height: 1067,
      alt: 'Participantes da Imersão LAMIT 2026',
    },
    reverse: true,
  },
]

export const communityCta = {
  href: 'https://chat.whatsapp.com/JKebVc0VWJpBCSHdorQ3b6',
}
