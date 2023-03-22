
all : commit_and_push

fclean: 
	rm -rf log/log-files/*

files = $(shell git diff --name-only HEAD)

commit_and_push: fclean
	git add . && git commit -m "changes $(files)" && git push;
