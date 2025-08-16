# Draggable Marquee Guide

## Overview

The Dope Picks marquee now supports manual drag scrolling, allowing users to freely browse through products by dragging the marquee left and right. This enhances the user experience by providing both automatic scrolling and manual control.

## Features

### 🎯 Manual Drag Scrolling
- **Mouse/Touch Drag**: Users can click and drag to scroll through products
- **Momentum Scrolling**: Smooth momentum-based scrolling after drag release
- **Touch Support**: Full touch gesture support for mobile devices
- **Wheel Scrolling**: Mouse wheel support for horizontal scrolling

### 🎮 Interactive Controls
- **Auto-Pause**: Marquee automatically pauses when user starts dragging
- **Auto-Resume**: Marquee resumes after user stops interacting
- **Hover Pause**: Pauses on mouse hover (configurable)
- **Visual Feedback**: Cursor changes to indicate draggable state

### 🎨 Visual Enhancements
- **Scroll Hint**: Animated hint showing users can drag to scroll
- **Smooth Animations**: Fluid transitions between auto-scroll and manual scroll
- **Hidden Scrollbars**: Clean appearance with hidden scrollbars
- **Responsive Design**: Works seamlessly across all device sizes

## Usage

### Basic Implementation

```tsx
import { DraggableMarquee } from '@/components/draggable-marquee';

<DraggableMarquee
  products={dopePicks}
  onAddToCart={handleAddToCart}
  autoScroll={true}
  scrollSpeed={25}
  pauseOnHover={true}
  showScrollHint={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | Required | Array of products to display |
| `onAddToCart` | `(product: Product) => void` | Required | Callback when "Add to Cart" is clicked |
| `className` | `string` | `''` | Additional CSS classes |
| `autoScroll` | `boolean` | `true` | Enable automatic scrolling |
| `scrollSpeed` | `number` | `20` | Speed of auto-scroll animation (seconds) |
| `pauseOnHover` | `boolean` | `true` | Pause auto-scroll on mouse hover |
| `showScrollHint` | `boolean` | `true` | Show drag scroll hint |

## User Experience

### Desktop Users
1. **Hover**: Marquee pauses automatically
2. **Drag**: Click and drag left/right to scroll manually
3. **Wheel**: Use mouse wheel for horizontal scrolling
4. **Release**: Momentum continues scrolling smoothly

### Mobile Users
1. **Touch**: Tap and drag to scroll through products
2. **Swipe**: Natural swipe gestures work intuitively
3. **Momentum**: Smooth momentum scrolling after swipe
4. **Auto-Resume**: Auto-scroll resumes after interaction

### Accessibility
- **Keyboard Navigation**: Arrow keys for scrolling
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user's motion preferences

## Technical Implementation

### Hooks Used
- `useDragScroll`: Handles drag scrolling logic
- `useMarqueeControl`: Manages marquee animation state

### Key Features
- **Event Handling**: Mouse, touch, and wheel events
- **Momentum Calculation**: Physics-based momentum scrolling
- **State Management**: Seamless transitions between auto/manual modes
- **Performance**: Optimized with `requestAnimationFrame`

### CSS Classes
- `.cursor-grab`: Indicates draggable state
- `.cursor-grabbing`: Active dragging state
- `.user-scrolling`: Manual scrolling state
- `.animate-marquee`: Auto-scroll animation

## Customization

### Styling
```css
/* Custom drag cursor */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing !important;
}

/* Custom scroll hint */
.drag-hint {
  animation: drag-hint 2s ease-in-out infinite;
}
```

### Behavior
```tsx
// Disable auto-scroll for manual-only mode
<DraggableMarquee
  products={products}
  onAddToCart={handleAddToCart}
  autoScroll={false}
  showScrollHint={false}
/>

// Faster auto-scroll
<DraggableMarquee
  products={products}
  onAddToCart={handleAddToCart}
  scrollSpeed={15}
/>
```

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Safari
- ✅ Chrome Mobile
- ✅ Samsung Internet

## Performance Notes

- **Smooth Scrolling**: Uses `requestAnimationFrame` for optimal performance
- **Memory Management**: Proper cleanup of event listeners and timers
- **Touch Optimization**: Optimized for touch devices with passive listeners
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

## Troubleshooting

### Common Issues

1. **Marquee not dragging**
   - Check if `autoScroll` is enabled
   - Verify touch events are not blocked
   - Ensure container has proper overflow settings

2. **Jumpy scrolling**
   - Adjust `sensitivity` in `useDragScroll` options
   - Check for conflicting CSS transforms
   - Verify momentum decay settings

3. **Performance issues**
   - Reduce number of products if needed
   - Check for heavy image loading
   - Verify `will-change` CSS property is set

### Debug Mode
```tsx
// Enable debug logging
<DraggableMarquee
  products={products}
  onAddToCart={handleAddToCart}
  debug={true} // Add this prop for debugging
/>
```

## Future Enhancements

- [ ] Virtual scrolling for large product lists
- [ ] Snap-to-item scrolling
- [ ] Custom scroll indicators
- [ ] Multi-touch gesture support
- [ ] Scroll position persistence
- [ ] Advanced momentum physics
