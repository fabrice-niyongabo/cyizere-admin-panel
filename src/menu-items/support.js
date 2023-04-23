// assets
import { ChromeOutlined, QuestionOutlined } from "@ant-design/icons";

const support = {
  id: "support",
  title: "Support",
  type: "group",
  children: [
    {
      id: "sample-page",
      title: "Sample Page",
      type: "item",
      url: "/sample-page",
      icon: ChromeOutlined,
    },
    {
      id: "documentation",
      title: "Documentation",
      type: "item",
      url: "https://codedthemes.gitbook.io/mantis-react/",
      icon: QuestionOutlined,
      external: true,
      target: true,
    },
  ],
};

export default support;
