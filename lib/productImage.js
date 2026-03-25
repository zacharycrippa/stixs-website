export const PRODUCT_IMAGE_FRAME_CLASS = 'w-full aspect-[4/7] overflow-hidden'

export const PRODUCT_IMAGE_PLACEHOLDER_CLASS = `${PRODUCT_IMAGE_FRAME_CLASS} flex items-center justify-center`

export const PRODUCT_IMAGE_PREVIEW_FRAME_CLASS = 'w-56 aspect-[4/7] overflow-hidden rounded border bg-gray-100'

export function getProductImageStyle(product = {}) {
  return {
    objectPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
    transform: `scale(${(product.imageScale ?? 100) / 100})`,
    transformOrigin: 'center',
  }
}