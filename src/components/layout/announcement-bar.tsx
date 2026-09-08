import { Container } from './container';

export function AnnouncementBar() {
  return (
    <div className="bg-mv-primary text-mv-inverse py-2 text-center text-xs sm:text-sm">
      <Container>
        <p>Free shipping on orders over ₨ 5,000 · Premium quality guaranteed</p>
      </Container>
    </div>
  );
}