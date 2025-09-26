// This React/Next.js component renders a simple organization chart using Tailwind CSS.
// The chart is generated from a nested data structure and uses plain HTML and CSS
// (no third‑party charting libraries) to draw the hierarchy and connecting lines.

import React from 'react';

/**
 * Type definition for each node in the organization chart. Every node can
 * optionally contain children, which will be rendered recursively.
 */
export interface OrgNode {
  /**
   * Unique identifier. This is required when rendering lists in React.
   */
  id: string;
  /**
   * Role or position title, e.g. “CEO”, “VP of Design”.
   */
  title: string;
  /**
   * Display name of the person occupying the role.
   */
  name: string;
  /**
   * Optional URL pointing to a photo/avatar for this person. If provided
   * the image will be displayed to the left of the name.
   */
  image?: string;
  /**
   * Optional numeric badge. In the example image this badge shows how
   * many reports fall under a particular VP. You can omit it or set it
   * to undefined if you don’t want to show a badge.
   */
  count?: number;
  /**
   * Recursive list of child nodes. When present, the component will draw
   * a connecting line and render the children beneath the current node.
   */
  children?: OrgNode[];
}

/**
 * OrgChartNode renders a single entry in the organization chart. It accepts
 * a node object and displays the person’s avatar, role, name and optional
 * badge. This component does not concern itself with child nodes – that is
 * handled higher up in the recursion.
 */
function OrgChartNode({ node }: { node: OrgNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
      {/* Avatar */}
      {node.image && (
        // The image uses the built‑in <img> element instead of Next.js's Image
        // component to avoid extra configuration. In a real project you can
        // replace <img> with <Image> from "next/image" for optimized images.
        <img
          src={node.image}
          alt={node.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      )}
      {/* Textual information */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 leading-tight">{node.title}</span>
        <span className="text-sm font-semibold leading-tight">{node.name}</span>
      </div>
      {/* Optional numeric badge */}
      {typeof node.count === 'number' && (
        <span className="ml-auto flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
          {node.count}
        </span>
      )}
    </div>
  );
}

/**
 * OrgChartBranch handles rendering of a node’s children. It draws a vertical
 * connector line to the left of the children and horizontal lines linking
 * each child back to its parent. Tailwind classes are used to avoid any
 * custom CSS. The layout is purely driven by flexbox and borders.
 */
function OrgChartBranch({ nodes }: { nodes: OrgNode[] }) {
  return (
    <ul className="mt-4 pl-8 border-l-2 border-gray-300 relative">
      {nodes.map((child, index) => (
        <li key={child.id} className="relative flex flex-col">
          {/* Horizontal connector from the vertical line to the node card */}
          <div className="absolute left-[-2px] top-6 w-4 border-t-2 border-gray-300"></div>
          {/* The child node itself */}
          <OrgChartNode node={child} />
          {/* Recursively render grandchildren */}
          {child.children && child.children.length > 0 && (
            <OrgChartBranch nodes={child.children} />
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * OrgChart is the top‑level component. Pass it a single root node and it will
 * render that node along with its descendants. You can wrap this component
 * anywhere in your Next.js application. It does not depend on any
 * client‑side only APIs and therefore works with both the Pages and App
 * routers.
 */
export default function OrgChart({ root }: { root: OrgNode }) {
  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded-lg">
      <OrgChartNode node={root} />
      {root.children && root.children.length > 0 && <OrgChartBranch nodes={root.children} />}
    </div>
  );
}

/**
 * Example usage:
 *
 * const data: OrgNode = {
 *   id: 'ceo',
 *   title: 'CEO',
 *   name: 'Whitney Blessing',
 *   image: '/avatars/ceo.png',
 *   children: [
 *     {
 *       id: 'cpo',
 *       title: 'CPO',
 *       name: 'Greg Wise',
 *       children: [
 *         { id: 'vp-design', title: 'VP of Design', name: 'Annie Bailey', image: '/avatars/annie.png', count: 8 },
 *         { id: 'vp-marketing', title: 'VP of Marketing', name: 'Micheal Graves', image: '/avatars/micheal.png', count: 12 },
 *       ],
 *     },
 *     {
 *       id: 'cfo',
 *       title: 'CFO',
 *       name: 'Alexis Gibson',
 *       children: [
 *         { id: 'vp-finance', title: 'VP of Finance', name: 'Teresa Ward', image: '/avatars/teresa.png', count: 6 },
 *         { id: 'vp-sales', title: 'VP of Sales', name: 'Victor Rose', image: '/avatars/victor.png', count: 10 },
 *       ],
 *     },
 *   ],
 * };
 *
 * <OrgChart root={data} />
 */