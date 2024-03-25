// eslint-disable-next-line no-unused-vars
function dalleModes() {
  return `<div id="dalle-mode-wrapper" class="w-full">
  <div class="flex justify-between bg-gradient-to-t from-token-main-surface-primary to-transparent">
    <div class="flex gap-2">
  ${dalleModeList?.sort(() => Math.random() - 0.5).slice(0, 5).map((mode) => `<span class="" data-state="closed">
        <button id="dalle-mode-option" type="button" class="h-7 bg-token-main-surface-primary rounded-md border border-token-border-light text-xs font-medium text-token-text-tertiary hover:bg-token-main-surface-secondary hover:text-token-text-primary px-2.5">${mode}</button>
      </span>`).join('')}
      <button id="dalle-mode-randomize" type="button" class="h-7 bg-token-main-surface-primary rounded-md border border-token-border-light text-xs font-medium text-token-text-tertiary hover:bg-token-main-surface-secondary hover:text-token-text-primary px-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="icon-sm" width="24" height="24">
          <path d="M3 18H4.17157C4.70201 18 5.21071 17.7893 5.58579 17.4142L15.4142 7.58579C15.7893 7.21071 16.298 7 16.8284 7H19M3 6H4.17157C4.70201 6 5.21071 6.21071 5.58579 6.58579L8 9M19 17H16.8284C16.298 17 15.7893 16.7893 15.4142 16.4142L14 15M18 4L21 7L18 10M18 14L21 17L18 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
      <img alt="35mm film" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2F35mm-film.c2b621c7.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2F35mm-film.c2b621c7.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2F35mm-film.c2b621c7.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Abstract" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fabstract.3dda8d5b.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fabstract.3dda8d5b.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fabstract.3dda8d5b.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Acrylic" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Facrylic.96b16414.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Facrylic.96b16414.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Facrylic.96b16414.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Aerial" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Faerial.e935ce99.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Faerial.e935ce99.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Faerial.e935ce99.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Art deco" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-deco.7a4014c6.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-deco.7a4014c6.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-deco.7a4014c6.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Art nouveau" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-nouveau.42a72185.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-nouveau.42a72185.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fart-nouveau.42a72185.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Artificial lighting" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fartificial-lighting.d54388f2.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fartificial-lighting.d54388f2.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fartificial-lighting.d54388f2.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Anime" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fanime.aa8ad930.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fanime.aa8ad930.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fanime.aa8ad930.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Baroque" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fbaroque.eeca6f27.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fbaroque.eeca6f27.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fbaroque.eeca6f27.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Black and white" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fblack-and-white.096590e0.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fblack-and-white.096590e0.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fblack-and-white.096590e0.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Cartoon" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcartoon.e3b358cd.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcartoon.e3b358cd.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcartoon.e3b358cd.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Cave art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcave-art.472e3013.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcave-art.472e3013.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcave-art.472e3013.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Chalk art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fchalk-art.8c4e63be.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fchalk-art.8c4e63be.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fchalk-art.8c4e63be.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Charcoal" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcharcoal.c0cf1f27.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcharcoal.c0cf1f27.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcharcoal.c0cf1f27.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Claymation" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclaymation.7285905d.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclaymation.7285905d.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclaymation.7285905d.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Close-up" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclose-up.8a1314e3.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclose-up.8a1314e3.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fclose-up.8a1314e3.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Comic book" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcomic-book.62ce0fcb.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcomic-book.62ce0fcb.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcomic-book.62ce0fcb.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Concept art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fconcept-art.33046684.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fconcept-art.33046684.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fconcept-art.33046684.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Cubism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcubism.25bd0d62.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcubism.25bd0d62.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcubism.25bd0d62.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Crayon" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcrayon.482118a6.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcrayon.482118a6.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fcrayon.482118a6.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Dawn" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdawn.2f296588.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdawn.2f296588.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdawn.2f296588.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Digital art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdigital-art.e90328fa.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdigital-art.e90328fa.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdigital-art.e90328fa.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Dusk" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdusk-lighting.b65392d6.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdusk-lighting.b65392d6.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdusk-lighting.b65392d6.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Dutch angle" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdutch-angle.ffd36d9d.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdutch-angle.ffd36d9d.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdutch-angle.ffd36d9d.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Dystopian" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdystopian.cd094b8c.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdystopian.cd094b8c.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fdystopian.cd094b8c.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Expressionism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fexpressionism.10db5314.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fexpressionism.10db5314.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fexpressionism.10db5314.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Extreme close-up" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fextreme-close-up.577e16ae.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fextreme-close-up.577e16ae.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fextreme-close-up.577e16ae.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Fantasy" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffantasy.0c4ca9c5.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffantasy.0c4ca9c5.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffantasy.0c4ca9c5.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Fauvism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffauvism.9761d1dc.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffauvism.9761d1dc.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffauvism.9761d1dc.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Felt" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffelt.d1fdc81b.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffelt.d1fdc81b.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffelt.d1fdc81b.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Film noir" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffilm-noir.ce99536c.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffilm-noir.ce99536c.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffilm-noir.ce99536c.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Fish-eye" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffish-eye.59e7768d.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffish-eye.59e7768d.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffish-eye.59e7768d.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Folk art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffolk-art.f7812812.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffolk-art.f7812812.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffolk-art.f7812812.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Futurism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffuturism.16f140ac.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffuturism.16f140ac.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ffuturism.16f140ac.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Golden hour" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgolden-hour.100bf29f.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgolden-hour.100bf29f.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgolden-hour.100bf29f.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Gothic" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgothic.8dc6239c.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgothic.8dc6239c.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgothic.8dc6239c.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Graffiti" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgraffiti.5391557c.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgraffiti.5391557c.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fgraffiti.5391557c.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Hand-drawn" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhand-drawn.8cf0fd02.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhand-drawn.8cf0fd02.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhand-drawn.8cf0fd02.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="High angle" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-angle.5c258f8f.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-angle.5c258f8f.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-angle.5c258f8f.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="High contrast" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-contrast.505f5bd2.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-contrast.505f5bd2.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fhigh-contrast.505f5bd2.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Impressionism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fimpressionism.5b26cc92.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fimpressionism.5b26cc92.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fimpressionism.5b26cc92.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Ink wash" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fink-wash.ab81ab6f.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fink-wash.ab81ab6f.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fink-wash.ab81ab6f.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Line art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fline-art.243de8ab.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fline-art.243de8ab.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fline-art.243de8ab.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Linocut" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flinocut.a7c4e99b.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flinocut.a7c4e99b.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flinocut.a7c4e99b.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Low angle" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-angle.f1aabcb0.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-angle.f1aabcb0.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-angle.f1aabcb0.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Low polygon" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-polygon.e556b64d.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-polygon.e556b64d.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Flow-polygon.e556b64d.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Minimalist" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fminimalist.c2220384.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fminimalist.c2220384.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fminimalist.c2220384.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Mosaic" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmosaic.4d9b518a.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmosaic.4d9b518a.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmosaic.4d9b518a.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Motion blur" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmotion-blur.924cd3cc.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmotion-blur.924cd3cc.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmotion-blur.924cd3cc.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Muted" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmuted.96715b42.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmuted.96715b42.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fmuted.96715b42.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Night" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fnight.b372773e.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fnight.b372773e.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fnight.b372773e.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Oil painting" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Foil-painting.13243692.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Foil-painting.13243692.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Foil-painting.13243692.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pastel" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpastel.16d4310a.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpastel.16d4310a.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpastel.16d4310a.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pencil sketch" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpencil-sketch.1ed59059.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpencil-sketch.1ed59059.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpencil-sketch.1ed59059.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pinhole camera" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpinhole-camera.a62d73c5.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpinhole-camera.a62d73c5.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpinhole-camera.a62d73c5.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pixel art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpixel-art.f4bee81b.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpixel-art.f4bee81b.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpixel-art.f4bee81b.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pointillism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpointillism.4d58b842.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpointillism.4d58b842.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpointillism.4d58b842.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Pop art" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpop-art.78079130.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpop-art.78079130.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fpop-art.78079130.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Retro" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fretro.bfd67ab0.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fretro.bfd67ab0.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fretro.bfd67ab0.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Rococo" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Frococo.2c6f22c5.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Frococo.2c6f22c5.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Frococo.2c6f22c5.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Sci-fi" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fscifi.f585fdc2.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fscifi.f585fdc2.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fscifi.f585fdc2.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Sculpture" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsculpture.fde46ee8.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsculpture.fde46ee8.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsculpture.fde46ee8.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Sepia" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsepia.adf47c2a.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsepia.adf47c2a.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsepia.adf47c2a.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Silk screen" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsilk-screen.32efc1fc.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsilk-screen.32efc1fc.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsilk-screen.32efc1fc.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Solarpunk" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsolarpunk.fa319cb3.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsolarpunk.fa319cb3.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsolarpunk.fa319cb3.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Steampunk" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsteampunk.baf1a98a.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsteampunk.baf1a98a.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsteampunk.baf1a98a.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Surrealism" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsurrealism.96ef0c53.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsurrealism.96ef0c53.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsurrealism.96ef0c53.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Synthwave" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsynthwave.9c356507.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsynthwave.9c356507.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fsynthwave.9c356507.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Tapestry" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ftapestry.a5070277.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ftapestry.a5070277.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Ftapestry.a5070277.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Ukiyo-e" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fukiyo-e.585a6caa.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fukiyo-e.585a6caa.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fukiyo-e.585a6caa.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Victorian" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fvictorian.bdcb705a.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fvictorian.bdcb705a.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fvictorian.bdcb705a.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Watercolor" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwatercolor.ae5d19b8.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwatercolor.ae5d19b8.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwatercolor.ae5d19b8.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Wide-angle" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwide-angle.982cbf3f.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwide-angle.982cbf3f.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwide-angle.982cbf3f.jpg&amp;w=256&amp;q=75" style="color: transparent;">
      <img alt="Woodcut" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" class="invisible fixed -left-96 -top-96" srcset="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwoodcut.e3a75dc4.jpg&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwoodcut.e3a75dc4.jpg&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcdn.oaistatic.com%2F_next%2Fstatic%2Fmedia%2Fwoodcut.e3a75dc4.jpg&amp;w=256&amp;q=75" style="color: transparent;">
    </div>
    <div class="flex gap-2">
      <button type="button" id="dalle-aspect-ratio-menu-button" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="inline-flex items-center justify-center gap-1 dark:transparent dark:bg-transparent outline-none cursor-pointer dark:hover:bg-token-main-surface-secondary focus-visible:border-green-500 dark:focus-visible:border-green-500 h-7 bg-token-main-surface-primary rounded-md border border-token-border-light text-xs font-medium text-token-text-tertiary hover:bg-token-main-surface-secondary hover:text-token-text-primary px-2.5 pr-1.5">Aspect Ratio <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  </div>
</div>`;
}
// eslint-disable-next-line no-unused-vars
function addDalleModeEventListeners() {
  const textAreaElement = document.querySelector('#prompt-textarea');

  // dalle-mode-option
  const dalleModeOptions = document.querySelectorAll('#dalle-mode-option');
  dalleModeOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
      const dalleMode = e.target.textContent;
      if (textAreaElement.value) {
        const showComma = textAreaElement.value.trim()[textAreaElement.value.trim().length - 1] !== ',';
        textAreaElement.value = `${textAreaElement.value}${showComma ? ',' : ''} ${dalleMode.toLowerCase()}`;
      } else {
        textAreaElement.value = `${dalleMode}, `;
      }
    });
    option.addEventListener('mouseover', (e) => {
      // find image with alt text
      const altText = e.target.textContent;
      const img = document.querySelector(`img[alt="${altText}"]`);
      if (img) {
        const newImage = img.cloneNode(true);
        newImage.classList = 'rounded-md';
        showDalleModeImage(e.target, altText, newImage.outerHTML);
      }
    });
    option.addEventListener('mouseout', () => {
      // find image with alt text
      const dalleModeImage = document.querySelector('#dalle-mode-image');
      if (dalleModeImage) {
        dalleModeImage.remove();
      }
    });
  });

  // dalle-mode-randomize
  const dalleModeRandomize = document.querySelector('#dalle-mode-randomize');
  dalleModeRandomize.addEventListener('click', () => {
    // replace dallemodeoptions with new ones
    dalleModeOptions.forEach((option) => {
      option.textContent = dalleModeList[Math.floor(Math.random() * dalleModeList.length)];
    });
  });
  // dalle-aspect-ratio-menu-button
  const dalleAspecRatioMenuButton = document.querySelector('#dalle-aspect-ratio-menu-button');
  dalleAspecRatioMenuButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const existingMenu = document.querySelector('#dalle-aspect-ratio-menu');
    if (existingMenu) {
      existingMenu.remove();
    } else {
      document.body.insertAdjacentHTML('beforeend', aspectRatioMenu(dalleAspecRatioMenuButton));
      const aspectRatioOptions = document.querySelectorAll('#dalle-aspec-ration-option');
      aspectRatioOptions.forEach((option) => {
        option.addEventListener('click', (event) => {
          const aspectRatio = event.target.textContent;
          if (textAreaElement.value) {
            const showComma = textAreaElement.value.trim()[textAreaElement.value.trim().length - 1] !== ',';
            textAreaElement.value = `${textAreaElement.value}${showComma ? ',' : ''} ${aspectRatio.toLowerCase()}`;
          } else {
            textAreaElement.value = `${aspectRatio}, `;
          }
        });
      });
    }
  });
}
function showDalleModeImage(targetElement, dalleMode, imageElement) {
  // find center of target element
  const rect = targetElement.getBoundingClientRect();
  const translateX = rect.left + (rect.width - 110) / 2;
  const translateY = rect.top - 140;
  const dalleModeImage = `<div id="dalle-mode-image" style="position: fixed; left: 0px; top: 0px; transform: translate(${translateX}px, ${translateY}px); min-width: max-content; z-index: auto;"><div data-side="top" data-align="center" data-state="delayed-open" class="relative rounded-lg border-white/10 bg-gray-950 p-1 shadow-xs transition-opacity dark:border max-w-xs"><span class="flex items-center whitespace-pre-wrap px-2 py-1 text-center font-medium normal-case text-gray-100 text-sm !p-0"><div class="flex flex-col gap-1">${imageElement}<div class="text-xs font-medium">${dalleMode}</div></div></span><span style="position: absolute; bottom: 0px; transform: translateY(100%); left: 50px;"><div width="10" height="5" viewbox="0 0 30 10" preserveaspectratio="none" class="relative top-[-4px] h-2 w-2 rotate-45 transform bg-gray-950 shadow-xs dark:border-r dark:border-b border-white/10" style="display: block;"></div></span><span role="tooltip" style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;"><span class="flex items-center whitespace-pre-wrap px-2 py-1 text-center font-medium normal-case text-gray-100 text-sm !p-0"><div class="flex flex-col gap-1">${imageElement}<div class="text-xs font-medium">${dalleMode}</div></div></span></span></div></div>`;
  document.body.insertAdjacentHTML('beforeend', dalleModeImage);
}
function aspectRatioMenu(dalleAspecRatioMenuButton) {
  const rect = dalleAspecRatioMenuButton.getBoundingClientRect();
  const translateX = rect.left;
  const translateY = rect.top - 110;
  return `<div id="dalle-aspect-ratio-menu" dir="ltr" style="position: fixed; left: 0px; top: 0px; transform: translate(${translateX}px, ${translateY}px); min-width: max-content; z-index: 1000000;"><div data-side="top" data-align="start" role="menu" aria-orientation="vertical" data-state="open" dir="ltr" class="min-w-[220px] rounded-lg popover bg-token-main-surface-primary p-[5px] shadow-xs will-change-[opacity,transform] border border-token-main-surface-secondary" tabindex="-1" data-orientation="vertical" style="outline: none; pointer-events: auto;"><div id="dalle-aspec-ration-option" role="menuitem" class="relative flex h-8 cursor-pointer select-none items-center rounded-md pl-3 pr-7 text-sm leading-none text-token-text-primary hover:bg-token-main-surface-secondary " tabindex="-1" data-orientation="vertical"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="icon-sm mr-2" width="24" height="24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"></rect></svg>Square</div><div id="dalle-aspec-ration-option" role="menuitem" class="relative flex h-8 cursor-pointer select-none items-center rounded-md pl-3 pr-7 text-sm leading-none text-token-text-primary hover:bg-token-main-surface-secondary " tabindex="-1" data-orientation="vertical"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="icon-sm mr-2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2"></rect></svg>Widescreen</div><div id="dalle-aspec-ration-option" role="menuitem" class="relative flex h-8 cursor-pointer select-none items-center rounded-md pl-3 pr-7 text-sm leading-none text-token-text-primary hover:bg-token-main-surface-secondary " tabindex="-1" data-orientation="vertical"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="icon-sm mr-2" width="24" height="24"><rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" stroke-width="2"></rect></svg>Vertical</div></div></div>`;
}
const dalleModeList = [
  '35mm film',
  'Abstract',
  'Acrylic',
  'Aerial',
  'Art deco',
  'Art nouveau',
  'Artificial lighting',
  'Anime',
  'Baroque',
  'Black and white',
  'Cartoon',
  'Cave art',
  'Chalk art',
  'Charcoal',
  'Claymation',
  'Close-up',
  'Comic book',
  'Concept art',
  'Cubism',
  'Crayon',
  'Dawn',
  'Digital art',
  'Dusk',
  'Dutch angle',
  'Dystopian',
  'Expressionism',
  'Extreme close-up',
  'Fantasy',
  'Fauvism',
  'Felt',
  'Film noir',
  'Fish-eye',
  'Folk art',
  'Futurism',
  'Golden hour',
  'Gothic',
  'Graffiti',
  'Hand-drawn',
  'High angle',
  'High contrast',
  'Impressionism',
  'Ink wash',
  'Line art',
  'Linocut',
  'Low angle',
  'Low polygon',
  'Minimalist',
  'Mosaic',
  'Motion blur',
  'Muted',
  'Night',
  'Oil painting',
  'Pastel',
  'Pencil sketch',
  'Pinhole camera',
  'Pixel art',
  'Pointillism',
  'Pop art',
  'Retro',
  'Rococo',
  'Sci-fi',
  'Sculpture',
  'Sepia',
  'Silk screen',
  'Solarpunk',
  'Steampunk',
  'Surrealism',
  'Synthwave',
  'Tapestry',
  'Ukiyo-e',
  'Victorian',
  'Watercolor',
  'Wide-angle',
  'Woodcut',
];
