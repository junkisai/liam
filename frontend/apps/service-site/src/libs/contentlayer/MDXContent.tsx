import { Callout } from '@/contents/components'
import { Code, Heading, LinkCard } from '@/features/posts'
import type { MDXComponents } from 'mdx/types'
// eslint-disable-next-line no-restricted-imports
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { Children, type FC, type ReactElement } from 'react'

const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <Heading as="h2" {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading as="h3" {...props}>
      {children}
    </Heading>
  ),
  h4: ({ children, ...props }) => (
    <Heading as="h4" {...props}>
      {children}
    </Heading>
  ),
  h5: ({ children, ...props }) => (
    <Heading as="h5" {...props}>
      {children}
    </Heading>
  ),
  pre: (props) => {
    const child = Children.only(props.children) as ReactElement

    return (
      <pre {...props}>
        <code>{child.props.children}</code>
      </pre>
    )
  },
  code: ({ children, ...props }) => <Code {...props}>{children}</Code>,
  LinkCard: (props) => <LinkCard {...props} />,
  Callout: (props) => <Callout {...props} />,
}

type Props = {
  code: string
}

export const MDXContent: FC<Props> = ({ code }) => {
  const Content = useMDXComponent(code)

  return <Content components={mdxComponents} />
}
