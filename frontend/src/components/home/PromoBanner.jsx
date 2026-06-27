const PromoBanner = () => {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <video
          src="/images/video-oatscrush.mp4"
          className="w-full rounded-3xl object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </section>
  );
};

export default PromoBanner;