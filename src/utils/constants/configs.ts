export type ModuleConfig = {
	description: string;
};

export type PathConfig = {
	root_dir_name: string;
};

export enum GithubRepoAccessType {
	private = 'private',
	public = 'public',
}

export type GithubConfig = {
	gh_org_username: string;
	gh_repo: string;
	gh_repo_access: GithubRepoAccessType;
	gh_username: string;
};

export type HatsConfig = ModuleConfig & PathConfig & GithubConfig;
