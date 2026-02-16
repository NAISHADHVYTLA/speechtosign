import { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

// Cache loaded animation clips to avoid re-fetching
const clipCache = new Map<string, THREE.AnimationClip | null>();
const loader = new GLTFLoader();

function loadAnimationClip(word: string): Promise<THREE.AnimationClip | null> {
  const path = `/animations/${word.toLowerCase()}.glb`;
  
  if (clipCache.has(path)) {
    return Promise.resolve(clipCache.get(path)!);
  }

  return new Promise((resolve) => {
    loader.load(
      path,
      (gltf) => {
        const clip = gltf.animations[0] || null;
        clipCache.set(path, clip);
        resolve(clip);
      },
      undefined,
      () => {
        // File not found — expected for words without animation files
        clipCache.set(path, null);
        resolve(null);
      }
    );
  });
}

export interface AnimationQueueItem {
  word: string;
  clip: THREE.AnimationClip | null; // null = use procedural pose fallback
}

export function useAnimationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);

  const loadAnimationsForWords = useCallback(async (words: string[]): Promise<AnimationQueueItem[]> => {
    abortRef.current = false;
    setIsLoading(true);
    
    const results: AnimationQueueItem[] = [];
    for (const word of words) {
      if (abortRef.current) break;
      const clip = await loadAnimationClip(word);
      results.push({ word, clip });
    }
    
    setIsLoading(false);
    return results;
  }, []);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { loadAnimationsForWords, isLoading, abort };
}
