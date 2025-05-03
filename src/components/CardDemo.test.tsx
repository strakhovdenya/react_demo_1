import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardDemo from './CardDemo';

describe('CardDemo', () => {
  it('отображает заголовок и описание', () => {
    render(<CardDemo title="Заголовок" description="Описание" />);
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
  });

  it('вызывает onMoreClick при клике на кнопку', () => {
    const onMoreClick = jest.fn();
    render(<CardDemo title="Заголовок" description="Описание" onMoreClick={onMoreClick} />);
    fireEvent.click(screen.getByText('Подробнее'));
    expect(onMoreClick).toHaveBeenCalled();
  });
}); 