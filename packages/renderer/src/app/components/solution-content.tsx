import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  dracula,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from './theme-provider'

type SolutionContentProps = {
  children: string
}

export function SolutionContent({ children }: SolutionContentProps) {
  const { theme } = useTheme()
  const style = theme === 'dark' ? dracula : oneLight

  return (
    <Markdown
      components={{
        code(props) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, className, node, ...rest } = props

          const match = /language-(\w+)/.exec(className || '')

          return match ? (
            <SyntaxHighlighter
              key={theme}
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={style}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
      }}
    >
      {children}
    </Markdown>
  )
}
