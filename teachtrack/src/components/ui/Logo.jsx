import teetee from '../../assets/images/teetee.png'

export default function Logo({ size = 64, alt = 'TeeTee — TeachTrack mascot', className = '', style }) {
  return (
    <img
      src={teetee}
      alt={alt}
      width={size}
      height={size}
      className={`tt-logo ${className}`}
      style={{ width: size, height: 'auto', ...style }}
    />
  )
}
