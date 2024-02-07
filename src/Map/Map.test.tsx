import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Map from './Map';

const locationsData = [
  {coordinates: [], name: 'location 1'},
  {coordinates: [], name: 'location 2'},
  {coordinates: [], name: 'location 3'},
  {coordinates: [], name: 'location 4'},
]
let showInfo: boolean;
const showInfoPanel = jest.fn((isShowPanel: boolean) => {
  showInfo = isShowPanel;
});
const makeSut = () => {
  return render(<Map/>)
}
test('check if info panel shows on initial render', () => {
  const { container } = makeSut();
  expect(container.querySelector('.location-info-wrapper')).toHaveStyle('width: 0');
});

test('check if info paned hidden after click on close button', () => {
  const { container } = makeSut();
  const element = screen.getByTestId('location-info-wrapper');
  element.setAttribute('style', 'width: 400px')
  expect(container.querySelector('.location-info-wrapper')).toHaveStyle('width: 400px');
})