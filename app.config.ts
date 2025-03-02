// https://github.com/nuxt-themes/alpine/blob/main/nuxt.schema.ts
export default defineAppConfig({
  alpine: {
    title: "Know-How Code by Artur Wojnar",
    description: "The blog",
    header: {
      position: "right", // possible value are : | 'left' | 'center' | 'right'
      logo: {
        path: "/logo.svg", // path of the logo
        pathDark: "/logo-dark.svg", // path of the logo in dark mode, leave this empty if you want to use the same logo
        alt: "Know-How Code", // alt of the logo
      },
    },
    footer: {
      credits: {
        enabled: false, // possible value are : true | false
        text: "Artur Wojnar",
        repository: "https://github.com/arturwojnar/blog", // our github repository
      },
      navigation: true, // possible value are : true | false
      alignment: "center", // possible value are : 'none' | 'left' | 'center' | 'right'
      message: "Follow me on", // string that will be displayed in the footer (leave empty or delete to disable)
    },
    socials: {
      linkedin: {
        icon: "uil:linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/artur-wojnar-a19349a6/",
      },
    },
    form: {
      successMessage: "Message sent. Thank you!",
    },
  },
});
