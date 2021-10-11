import React from "react";
import { ReactDOM } from "react-dom";
import App from "../App";
import { render, fireEvent } from "@testing-library/react";
import axiosMock from "../__mocks__/axios";
import "@testing-library/jest-dom/extend-expect";

describe("Teste do componente de listar moedas", () => {
  it("deve renderizar o componente sem erros", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });

  it("Deve simular uma conversao de moedas", async () => {
    //assincrona  sincrona
    const { findByTestId, getByTestId } = render(<App />);
    axiosMock.get.mockResolvedValueOnce({
      data: { success: true, rate: { BRL: 4.564292, USD: 1.101049 } },
    });
    fireEvent.click(getByTestId("btn-converter"));
    const modal = await findByTestId("modal");
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(modal).toHaveTextContent("1 BRL = 0.24 USD");
  });
});
//https://pt-br.reactjs.org/docs/testing-recipes.html
