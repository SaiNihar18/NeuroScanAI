import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/use-page-title';

const NotFound = () => {
  usePageTitle('Page not found');

  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="num text-sm font-semibold text-primary">404</p>
      <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  );
};

export default NotFound;
