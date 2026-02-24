import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        Credat
      </span>
    }
    projectLink="https://github.com/credat/credat"
  />
);

const footer = (
  <Footer>
    <span>MIT {new Date().getFullYear()} Credat.</span>
  </Footer>
);

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout
        navbar={navbar}
        pageMap={await getPageMap("/docs")}
        docsRepositoryBase="https://github.com/credat/credat-docs/tree/main/src/content/docs"
        footer={footer}
        sidebar={{ defaultMenuCollapseLevel: 1 }}
        editLink="Edit this page on GitHub"
      >
        {children}
      </Layout>
    </>
  );
}
