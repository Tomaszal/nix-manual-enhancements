{
  description = "Nix Manual Enhancements";

  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
    # https://github.com/nix-community/nixd/blob/main/docs/user-guide.md#how-to-use-nixd-in-my-flake
    flake-compat = {
      url = "github:inclyc/flake-compat";
      flake = false;
    };
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux"];
      perSystem = {pkgs, ...}: {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            just
            graphviz

            # Nix tools
            nixd
            alejandra

            # JS tools
            bun
            nodejs # https://github.com/oven-sh/bun/issues/4591
          ];
        };
      };
    };
}
