import fs from 'fs'

function sanitizeKey(header) {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}

function transformEmphasis(text) {
  return text.replace(/_(.*?)_/g, '<span class="emphasis">$1</span>') // Convert _text_ to <span> tags
}

parseMarkdown = function (filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8')

  // Remove commented sections
  const uncommentedContent = fileContent.replace(/<!--[\s\S]*?-->/g, '')

  const lines = uncommentedContent.split('\n')
  const result = {}
  let currentKey = null

  for (let line of lines) {
    line = line.trim()

    // If line is a header
    if (line.startsWith('## ')) {
      currentKey = sanitizeKey(line.slice(3)) // Extract header and sanitize
      result[currentKey] = []
    } else if (currentKey && line && !line.startsWith('-')) {
      // Normal line, not part of a list and not empty
      result[currentKey].push(transformEmphasis(line))
    }
  }

  return result
}
