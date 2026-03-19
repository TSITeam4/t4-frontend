import Button from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1
        className="font-display font-semibold leading-none"
        style={{
          fontSize: 'clamp(6rem, 15vw, 12rem)',
          color: 'var(--color-text-primary)',
        }}
      >
        404.
      </h1>

      <p
        className="font-body mt-6"
        style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-text-secondary)',
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div className="mt-10">
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
