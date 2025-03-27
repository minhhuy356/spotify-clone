import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppSelector } from "@/lib/hook";
import ArtistCard from "./artists.left";
import TracksCard from "./track.sleft";
import AlbumsCard from "./albums.left";
import { ChooseLibraryBy } from "../left.main";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
}

const ListLibrary = ({ chooseLibraryBy, setChooseLibraryBy }: IProps) => {
  return (
    <div>
      <ArtistCard
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />
      <TracksCard
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />
      <AlbumsCard
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />
    </div>
  );
};

export default ListLibrary;
