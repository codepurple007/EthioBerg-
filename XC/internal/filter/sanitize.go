package filter

import (
	"regexp"
	"strings"
	"unicode/utf8"
)

var multiSpace = regexp.MustCompile(`\s+`)

func CleanText(input string) string {
	if !utf8.ValidString(input) {
		input = strings.ToValidUTF8(input, "")
	}
	return strings.TrimSpace(multiSpace.ReplaceAllString(input, " "))
}
