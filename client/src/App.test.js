import { render } from "../utils/unitTests";
import App from "./App";

describe("<App />", () => {
  test("renders without crashing", () => {
    render(<App />);
  });
});
