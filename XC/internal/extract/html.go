package extract

import (
	"strings"

	"golang.org/x/net/html"
)

type Document struct {
	Title string
	Body  string
}

func FromHTML(rawHTML string) Document {
	doc, err := html.Parse(strings.NewReader(rawHTML))
	if err != nil {
		return Document{}
	}

	var title string
	var h1 string
	var articleBuilder strings.Builder
	var paragraphBuilder strings.Builder
	inArticle := 0

	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if n.Type == html.ElementNode {
			switch n.Data {
			case "script", "style", "noscript", "aside", "nav", "footer", "header":
				return
			case "article", "main":
				inArticle++
				defer func() { inArticle-- }()
			}
		}

		if n.Type == html.TextNode {
			text := strings.TrimSpace(n.Data)
			if text == "" {
				return
			}
			parent := n.Parent
			if parent != nil && parent.Type == html.ElementNode {
				switch parent.Data {
				case "title":
					if title == "" {
						title = text
					}
				case "h1":
					if h1 == "" {
						h1 = text
					}
					fallthrough
				case "p", "li", "td", "th", "blockquote", "pre", "span", "div", "a", "strong", "em", "b", "i", "section":
					if inArticle > 0 {
						articleBuilder.WriteString(text)
						articleBuilder.WriteByte(' ')
					} else if parent.Data == "p" || parent.Data == "li" || parent.Data == "h1" {
						paragraphBuilder.WriteString(text)
						paragraphBuilder.WriteByte(' ')
					}
				}
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			walk(c)
		}
	}
	walk(doc)

	body := strings.TrimSpace(articleBuilder.String())
	if body == "" {
		body = strings.TrimSpace(paragraphBuilder.String())
	}

	if title == "" {
		title = h1
	}

	return Document{
		Title: title,
		Body:  body,
	}
}
