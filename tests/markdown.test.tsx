import { render, screen } from '@testing-library/react';
import { Markdown } from '../src/components/ui/Markdown';
import { stripMemory } from '../src/pages/Tutor';

describe('Markdown renderer', () => {
  it('renders headings, lists, bold, italics and code safely', () => {
    const { container } = render(<Markdown text={'## Title\n\n- **bold** item\n- _soft_ item\n\n1. one\n2. two\n\nUse `ANTHROPIC_API_KEY` now <script>alert(1)</script>'} />);
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(container.querySelector('strong')?.textContent).toBe('bold');
    expect(container.querySelector('em')?.textContent).toBe('soft');
    expect(container.querySelector('code')?.textContent).toBe('ANTHROPIC_API_KEY');
    expect(container.querySelectorAll('ol li')).toHaveLength(2);
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<script>');
  });
  it('only links http(s) URLs', () => {
    const { container } = render(<Markdown text={'[ok](https://example.com) [bad](javascript:alert(1))'} />);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(container.querySelector('a')?.getAttribute('rel')).toContain('noopener');
  });
});

describe('tutor memory extraction', () => {
  it('strips the REMEMBER line and returns the fact', () => {
    const r = stripMemory('Great question!\n\nREMEMBER: Struggles with komal Re');
    expect(r.text).toBe('Great question!');
    expect(r.memory).toBe('Struggles with komal Re');
  });
  it('leaves normal text untouched', () => {
    expect(stripMemory('Hello').memory).toBeUndefined();
  });
});
