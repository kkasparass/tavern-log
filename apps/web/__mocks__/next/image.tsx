// eslint-disable-next-line @next/next/no-img-element -- intentional plain <img> in mock, next/image not needed in tests
const Image = ({ alt }: { alt: string }) => <img alt={alt} />;

export default Image;
