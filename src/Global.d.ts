declare namespace global {
  interface Window {
    [Key: string]: string;
  }

  interface document {
    [Key: string]: string;
  }
}
