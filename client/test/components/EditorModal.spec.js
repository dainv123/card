import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditorModal from '../../components/EditorModal/EditorModal';
import { SELECT_THEME, SUBMIT } from '../../constants/wording';
import { FIRST_NODE, FIRST_VALUE, THEME_PROPERTIES } from '../data/theme';
import '@testing-library/jest-dom/extend-expect'; 

describe('EditorModal component', () => {
  const mockData = THEME_PROPERTIES;
  const mockHandleOk = jest.fn();
  const mockHandleCancel = jest.fn();
  const mockHandleScrollToElement = jest.fn();

  it('should check that two input elements are nearby', () => {
    render(
      <EditorModal
        data={mockData}
        isModalOpen={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
        handleScrollToElement={mockHandleScrollToElement}
      />
    );

    // expect(document.body).toMatchSnapshot();
    const firstInput = screen.getByDisplayValue(FIRST_NODE);
    expect(firstInput).toBeInTheDocument();
    const secondInput = firstInput.parentElement.querySelector('input:not([disabled])');
    expect(secondInput).toBeInTheDocument();
    expect(secondInput).toHaveValue(FIRST_VALUE);
  });

  it('calls handleOk when submit button is clicked', () => {
    const { getByText } = render(
      <EditorModal
        data={mockData}
        isModalOpen={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
        handleScrollToElement={mockHandleScrollToElement}
      />
    );

    // Click the submit button
    fireEvent.click(getByText(SUBMIT));

    // Expect handleOk to be called
    expect(mockHandleOk).toHaveBeenCalled();
  });
});
