import { render, screen } from "../../../utils/unitTests";
import Header from "./index";

describe("Header Component", () => {
  test("renders English Quiz in the Header", () => {
    render(<Header />);
    const typographyElement = screen.getByText("English Quiz");
    expect(typographyElement).toBeInTheDocument();
  });
});
