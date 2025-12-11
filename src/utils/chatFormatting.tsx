import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

/**
 * Componentes personalizados para react-markdown
 * Permite aplicar estilos CSS a los elementos de markdown
 */
const markdownComponents: Components = {
  // Encabezados
  h1: ({ children }) => (
    <h1 className="ai-vet-assistant__heading ai-vet-assistant__heading--h1">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="ai-vet-assistant__heading ai-vet-assistant__heading--h2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="ai-vet-assistant__heading ai-vet-assistant__heading--h3">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="ai-vet-assistant__heading ai-vet-assistant__heading--h4">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="ai-vet-assistant__heading ai-vet-assistant__heading--h5">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="ai-vet-assistant__heading ai-vet-assistant__heading--h6">
      {children}
    </h6>
  ),
  // Párrafos
  p: ({ children }) => (
    <p className="ai-vet-assistant__paragraph">{children}</p>
  ),
  // Listas
  ul: ({ children }) => (
    <ul className="ai-vet-assistant__list ai-vet-assistant__list--unordered">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="ai-vet-assistant__list ai-vet-assistant__list--ordered">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="ai-vet-assistant__list-item">{children}</li>
  ),
  // Texto en negritas
  strong: ({ children }) => (
    <strong className="ai-vet-assistant__bold">{children}</strong>
  ),
  // Texto en cursiva
  em: ({ children }) => (
    <em className="ai-vet-assistant__italic">{children}</em>
  ),
  // Código inline
  code: ({ children, className }) => {
    const isInline = !className;
    return isInline ? (
      <code className="ai-vet-assistant__code-inline">{children}</code>
    ) : (
      <code className="ai-vet-assistant__code-block">{children}</code>
    );
  },
  // Bloques de código
  pre: ({ children }) => (
    <pre className="ai-vet-assistant__pre">{children}</pre>
  ),
  // Enlaces
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ai-vet-assistant__link"
    >
      {children}
    </a>
  ),
  // Saltos de línea
  br: () => <br className="ai-vet-assistant__break" />,
  // Líneas horizontales
  hr: () => <hr className="ai-vet-assistant__hr" />,
  // Citas
  blockquote: ({ children }) => (
    <blockquote className="ai-vet-assistant__blockquote">{children}</blockquote>
  ),
};

/**
 * Renderiza el texto con formato markdown completo usando react-markdown
 * Soporta: encabezados, listas, negritas, cursivas, código, enlaces, etc.
 */
export const renderFormattedText = (text: string) => {
  return <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>;
};
