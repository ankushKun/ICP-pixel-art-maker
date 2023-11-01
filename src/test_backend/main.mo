import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor {
  var map = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public query func addArt(creator : Text, imgB64 : Text) : async Nat {
    map.put(creator, imgB64);
    var id = map.size();
    return id;
  };

  public query func getArt(creator : Text) : async ?Text {
    var b64 = map.get(creator);
    return b64;
  };

  public query func getArtCount() : async Nat {
    return map.size();
  };

  public query func getMapKeys() : async Iter.Iter<Text> {
    return map.keys();
  };

  public query func getAllArt() : async Iter.Iter<(Text, Text)> {
    return map.entries();
  };
};
