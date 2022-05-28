/* eslint-disable react/jsx-no-undef */
import {render,screen} from '@testing-library/react';
import Mainpage from './components/mainpage/mainpage'

test('keywordDocker', () => {
    render(<Mainpage />)
    expect(screen.getByText("Docker")).toBeInTheDocument()
  })
  
//   test('keyworkDatabase', () => {
//     render(<MainPage />)
//     expect(screen.getByText(/Database MongoDB/i)).toBeInTheDocument()
//   })