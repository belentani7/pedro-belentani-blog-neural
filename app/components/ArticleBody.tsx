type ParagraphBlock = Readonly<{
  type: "paragraph";
  text: string;
}>;

type OrderedListBlock = Readonly<{
  type: "ordered-list";
  items: readonly string[];
}>;

type ArticleBlock = ParagraphBlock | OrderedListBlock;

type ArticleBodyProps = Readonly<{
  content: string;
}>;

function parseBlocks(content: string): readonly ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      type: "ordered-list",
      items: listItems,
    });
    listItems = [];
  };

  for (const sourceLine of content.replace(/\r\n?/g, "\n").split("\n")) {
    const line = sourceLine.trim();

    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    const listItem = line.match(/^\d+\.[\t ]+(.+)$/);

    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="article-body">
      {blocks.map((block, blockIndex) => {
        if (block.type === "ordered-list") {
          return (
            <ol className="article-body__list" key={`list-${blockIndex}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${blockIndex}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p className="article-body__paragraph" key={`paragraph-${blockIndex}`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
