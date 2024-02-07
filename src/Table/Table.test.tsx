import {fireEvent, getAllByRole, render, renderHook, screen} from "@testing-library/react";
import React, {useEffect} from "react";
import Table from "./Table";
const mockData = [
  {
    coordinates: Array<any>, name: 'loc 1', key: 0
  },
  {
    coordinates: Array<any>, name: 'loc 2', key: 1
  }
]
const makeSut = ({data}: any) => {
  return render(<Table data={mockData}/>)
}

test('check able to edit after click on edit btn', () => {
  const { getByTestId } = makeSut({data: mockData});
  const inputElement = getByTestId('editable-input0');
  fireEvent.click(getByTestId('onedit-btn0'));
  expect(inputElement).not.toHaveAttribute('disabled');
});
test('check added new row after add button clicked', () => {
  const { getByTestId,container } = makeSut({data: mockData});
  fireEvent.click(getByTestId('btn-add'));
  expect(container.querySelector('.table-row-new')).toBeInTheDocument();
})