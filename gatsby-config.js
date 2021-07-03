require(`dotenv`).config()

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE
const googleAnalyticsTrackingId = process.env.GOOGLE_ANALYTICS_ID

module.exports = {
    siteMetadata: {
        siteTitle: `ashwanth.io`,
        siteTitleAlt: `Ashwanth A R`,
        siteHeadline: `Developer Blog - Ashwanth`,
        siteUrl: `https://ashwanth.io`,
        siteDescription: `I write about the cloud, and everything-software under the sun.`,
        siteLanguage: `en`,
        siteImage: `/banner.jpg`,
        author: `@ashwanth1109`,
    },
    flags: {
        FAST_DEV: true,
    },
    plugins: [
        {
            resolve: `@lekoarts/gatsby-theme-minimal-blog`,
            // See the theme's README for all available options
            options: {
                externalLinks: [
                    {
                        name: `GitHub`,
                        url: `https://github.com/ashwanth1109`,
                    },
                    {
                        name: `LinkedIn`,
                        url: `https://www.linkedin.com/in/ashwanth-a-r/`,
                    },
                    {
                        name: `Twitter`,
                        url: `https://twitter.com/ashwanth1109`,
                    }
                ],
            },
        },
        {
            resolve: `gatsby-omni-font-loader`,
            options: {
                enableListener: true,
                preconnect: [`https://fonts.gstatic.com`],
                interval: 300,
                timeout: 30000,
                web: [
                    {
                        name: `Source Sans Pro`,
                        file: `https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap`,
                    },
                ],
            },
        },
        googleAnalyticsTrackingId && {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: process.env.GOOGLE_ANALYTICS_ID,
            },
        },
        `gatsby-plugin-sitemap`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Ashwanth's Blog`,
                short_name: `ashwanth-blog`,
                description: `I write about the cloud, and everything-software under the sun.`,
                start_url: `/`,
                background_color: `#fff`,
                theme_color: `#6B46C1`,
                display: `standalone`,
                icons: [
                    {
                        src: `/android-chrome-192x192.png`,
                        sizes: `192x192`,
                        type: `image/png`,
                    },
                    {
                        src: `/android-chrome-512x512.png`,
                        sizes: `512x512`,
                        type: `image/png`,
                    },
                ],
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-gatsby-cloud`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
          {
            site {
              siteMetadata {
                title: siteTitle
                description: siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
                feeds: [
                    {
                        serialize: ({query: {site, allPost}}) =>
                            allPost.nodes.map((post) => {
                                const url = site.siteMetadata.siteUrl + post.slug
                                const content = `<p>${post.excerpt}</p><div style="margin-top: 50px; font-style: italic;"><strong><a href="${url}">Keep reading</a>.</strong></div><br /> <br />`

                                return {
                                    title: post.title,
                                    date: post.date,
                                    excerpt: post.excerpt,
                                    url,
                                    guid: url,
                                    custom_elements: [{"content:encoded": content}],
                                }
                            }),
                        query: `
              {
                allPost(sort: { fields: date, order: DESC }) {
                  nodes {
                    title
                    date(formatString: "MMMM D, YYYY")
                    excerpt
                    slug
                  }
                }
              }
            `,
                        output: `rss.xml`,
                        title: `Minimal Blog - @lekoarts/gatsby-theme-minimal-blog`,
                    },
                ],
            },
        },
        shouldAnalyseBundle && {
            resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
            options: {
                analyzerMode: `static`,
                reportFilename: `_bundle.html`,
                openAnalyzer: false,
            },
        },
        {resolve: `gatsby-plugin-s3`, options: {bucketName: `ashwanth.io`}}
    ].filter(Boolean),
}
