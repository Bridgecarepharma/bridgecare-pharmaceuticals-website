"use client";

import { useRef } from "react";

function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || "Text";
  textarea.setRangeText(`${before}${selected}${after}`, start, end, "select");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.focus();
}

export function ArticleEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const apply = (before: string, after: string) => {
    if (ref.current) wrapSelection(ref.current, before, after);
  };

  return (
    <div className="article-editor">
      <div className="article-editor__toolbar" aria-label="Article formatting toolbar">
        <button type="button" onClick={() => apply("<h2>", "</h2>")}>Heading</button>
        <button type="button" onClick={() => apply("<strong>", "</strong>")}>Bold</button>
        <button type="button" onClick={() => apply("<em>", "</em>")}>Italic</button>
        <button type="button" onClick={() => apply("<p>", "</p>")}>Paragraph</button>
        <button type="button" onClick={() => apply("<blockquote>", "</blockquote>")}>Quote</button>
        <button type="button" onClick={() => apply("<ul><li>", "</li></ul>")}>Bullets</button>
        <button type="button" onClick={() => apply('<a href="https://">', "</a>")}>Link</button>
      </div>
      <textarea
        ref={ref}
        name="contentHtml"
        defaultValue={defaultValue}
        rows={22}
        required
        placeholder="Write the article here. Use the toolbar to add headings, paragraphs, lists and links."
      />
      <small>Trusted admin HTML is supported. Scripts, iframes and inline event handlers are removed when saving.</small>
    </div>
  );
}
