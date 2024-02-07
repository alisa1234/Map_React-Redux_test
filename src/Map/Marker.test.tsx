import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Marker from "./Marker";

const locationsData = [
  {coordinates: [0, 0], name: 'location 1'},
  {coordinates: [], name: 'location 2'},
  {coordinates: [], name: 'location 3'},
  {coordinates: [], name: 'location 4'},
]
let locationClickedIndex: number;
const showInfoPanel = (location: any, index: number) => {
  locationClickedIndex = index;
  console.log('onClick', location, index, locationClickedIndex);
}
const makeSut = ({text, onClick, isShowText}: any) => {
  return render(
          <Marker
                  text={text}
                  onClick={() => onClick}
                  isShowText={isShowText}
          />
  )
}

test('check if marker text shows on initial render', () => {
  const { container } = makeSut({text: locationsData[0].name,
    onClick: () => showInfoPanel(locationsData[0], 0), isShowText: false});

  expect(container.querySelector('.marker-text')).not.toBeInTheDocument();
});

test('check if marker appears after click', () => {
  const { getByTestId } = makeSut({text: locationsData[0].name,
    onClick: () => showInfoPanel(locationsData[0], 0), isShowText: true});

  fireEvent.click(getByTestId('marker-btn'));
  expect(getByTestId('marker-test')).toBeInTheDocument();
});