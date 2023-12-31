export interface PageData {
  page_name: string;
  display_name: string;
  config: {
    links: {
      id: number;
      url: string;
      style: string;
      text: string;
    }[]
  },
  theme: {
    primary: string;
    button: string;
  },
  content: ContentBlock[],
  avatar_url?: string;
  header_image_url?: string;
}

export interface ContentBlock {
  id: number;
  url: string;
  style: string;
  text: string;
  type: string;
}
