import os
import shutil
from pathlib import Path
from typing import Union

class VisionCapture:
    def __init__(self, storage_dir: Union[str, Path] = "storage/vision_buffer", max_history: int = 5):
        self.storage_dir = Path(storage_dir)
        self.max_history = max_history
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        
    def capture(self, frame_bytes: bytes) -> None:
        """
        Stores a new frame as current.png, shifting older frames to T-1.png ... T-5.png.
        Frames older than max_history are purged.
        """
        # 1. Remove the oldest frame if it exists
        oldest = self.storage_dir / f"T-{self.max_history}.png"
        if oldest.exists():
            oldest.unlink()
            
        # 2. Shift older frames
        for i in range(self.max_history - 1, 0, -1):
            old = self.storage_dir / f"T-{i}.png"
            new = self.storage_dir / f"T-{i+1}.png"
            if old.exists():
                old.rename(new)
                
        # 3. Shift current to T-1
        current = self.storage_dir / "current.png"
        if current.exists():
            current.rename(self.storage_dir / "T-1.png")
            
        # 4. Save new frame as current
        with open(current, "wb") as f:
            f.write(frame_bytes)

    def get_history(self) -> list[bytes]:
        """
        Retrieves the chronological history of frames from oldest to newest.
        """
        history = []
        for i in range(self.max_history - 1, -1, -1):
            if i == 0:
                target = self.storage_dir / "current.png"
            else:
                target = self.storage_dir / f"T-{i}.png"
                
            if target.exists():
                with open(target, "rb") as f:
                    history.append(f.read())
        return history
