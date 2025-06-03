import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head prefix="og: http://ogp.me/ns#">
          <meta
            name="description"
            content="Say goodbye to the stress and hassle of degree planning and hello to a smooth, organized path towards graduation with Nebula Planner."
          />
          <meta name="theme-color" content="#573DFF" />

          <meta property="og:title" content="Nebula Planner" />
          <meta
            property="og:description"
            content="Say goodbye to the stress and hassle of degree planning and hello to a smooth, organized path towards graduation with Nebula Planner."
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://planner.utdnebula.com/logoIcon.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:alt" content="Nebula Labs Icon." />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:domain" content="planner.utdnebula.com" />

          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
