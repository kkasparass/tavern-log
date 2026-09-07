const Image = ({ alt, className }: { alt: string; className?: string }) => {
  // eslint-disable-next-line @next/next/no-img-element -- intentional plain <img> in mock, next/image not needed in tests
  return <img alt={alt} className={className} />;
};

export default Image;
