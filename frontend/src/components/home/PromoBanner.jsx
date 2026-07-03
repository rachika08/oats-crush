const PromoBanner = () => {
  return (
    <section className="py-6 sm:py-10">
      <video
        src="/images/video-oatscrush.mp4"
        className="w-full h-[85vh] sm:h-auto sm:max-h-[100vh] rounded-none sm:rounded-3xl object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};

export default PromoBanner;