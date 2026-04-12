import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Divider from '../index.vue';

describe('Divider', () => {
  it('renders with default props', () => {
    const wrapper = mount(Divider);
    expect(wrapper.classes()).toContain('px-divider');
    expect(wrapper.classes()).toContain('px-divider__horizontal');
    expect(wrapper.classes()).toContain('px-divider__solid');
    expect(wrapper.classes()).not.toContain('px-divider__soft');
    expect(wrapper.attributes('style')).toBeUndefined();
  });

  it('applies direction class and margin styles correctly', () => {
    const wrapperHorizontal = mount(Divider, {
      props: { direction: 'horizontal', margin: '16px' }
    });
    expect(wrapperHorizontal.classes()).toContain('px-divider__horizontal');
    expect(wrapperHorizontal.element.style.marginTop).toBe('16px');
    expect(wrapperHorizontal.element.style.marginBottom).toBe('16px');
    expect(wrapperHorizontal.element.style.marginLeft).toBe('');
    expect(wrapperHorizontal.element.style.marginRight).toBe('');

    const wrapperVertical = mount(Divider, {
      props: { direction: 'vertical', margin: '1rem' }
    });
    expect(wrapperVertical.classes()).toContain('px-divider__vertical');
    expect(wrapperVertical.element.style.marginLeft).toBe('1rem');
    expect(wrapperVertical.element.style.marginRight).toBe('1rem');
    expect(wrapperVertical.element.style.marginTop).toBe('');
    expect(wrapperVertical.element.style.marginBottom).toBe('');
  });

  it('applies variant class', () => {
    const variants = ['solid', 'dashed', 'dotted'] as const;
    for (const variant of variants) {
      const wrapper = mount(Divider, { props: { variant } });
      expect(wrapper.classes()).toContain(`px-divider__${variant}`);
    }
  });

  it('applies soft class when soft prop is true', () => {
    const wrapper = mount(Divider, { props: { soft: true } });
    expect(wrapper.classes()).toContain('px-divider__soft');
  });

  it('applies color style', () => {
    const color = 'rgb(255, 0, 0)';
    const wrapper = mount(Divider, { props: { color } });
    expect(wrapper.element.style.borderColor).toBe(color);
  });

  it('handles margin as number (converts to px)', () => {
    const wrapper = mount(Divider, { props: { margin: 8 } });
    expect(wrapper.element.style.marginTop).toBe('8px');
    expect(wrapper.element.style.marginBottom).toBe('8px');
  });

  it('handles margin as string (passes as is)', () => {
    const wrapper = mount(Divider, { props: { margin: '2em' } });
    expect(wrapper.element.style.marginTop).toBe('2em');
    expect(wrapper.element.style.marginBottom).toBe('2em');
  });

  it('does not apply margin style when margin is nullish', () => {
    const wrapperNoMargin = mount(Divider, { props: { margin: undefined } });
    expect(wrapperNoMargin.element.style.marginTop).toBe('');
    expect(wrapperNoMargin.element.style.marginBottom).toBe('');

    const wrapperUndefined = mount(Divider, { props: { margin: undefined } });
    expect(wrapperUndefined.element.style.marginTop).toBe('');
    expect(wrapperUndefined.element.style.marginBottom).toBe('');
  });

  it('handles size as number (converts to px) for divider', () => {
    const wrapper = mount(Divider, { props: { size: 3, direction: 'horizontal' } });
    expect(wrapper.element.style.borderBottomWidth).toBe('3px');
  });

  it('handles size as string for divider', () => {
    const wrapper = mount(Divider, { props: { size: '0.25rem', direction: 'horizontal' } });
    expect(wrapper.element.style.borderBottomWidth).toBe('0.25rem');
  });

  it('combines multiple props correctly', () => {
    const wrapper = mount(Divider, {
      props: {
        direction: 'vertical',
        variant: 'dotted',
        soft: true,
        color: 'rgba(0,0,0,0.5)',
        margin: '10px',
        size: '4px'
      }
    });
    expect(wrapper.classes()).toContain('px-divider__vertical');
    expect(wrapper.classes()).toContain('px-divider__dotted');
    expect(wrapper.classes()).toContain('px-divider__soft');
    expect(wrapper.element.style.borderColor).toBe('rgba(0, 0, 0, 0.5)');
    expect(wrapper.element.style.marginLeft).toBe('10px');
    expect(wrapper.element.style.marginRight).toBe('10px');
    expect(wrapper.element.style.borderRightWidth).toBe('4px');
  });
});