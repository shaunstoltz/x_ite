#!/usr/bin/perl
# -*- Mode: Perl; coding: utf-8; tab-width: 3; indent-tabs-mode: t; c-basic-offset: 3 -*-

use strict;
use warnings;
use v5.10.0;
use open qw/:std :utf8/;

my $CWD = `pwd`;
chomp $CWD;

say $CWD;

my $VERSION = `cat src/excite/Browser/VERSION.js`;
$VERSION =~ /"(.*?)"/;
$VERSION = $1;

sub check_version {
	system "perl", "build/check-version.pl"
}

sub dist {
	system "cp", "-v", "src/excite.css",    "dist/";
	system "cp", "-v", "src/spinner.css",   "dist/";
	system "cp", "-v", "-r", "src/images",  "dist/";
	system "cp", "-v", "src/browser.html",  "dist/";
}

sub licenses {
	my $min = `cat 'dist/excite.min.js'`;

	$min =~ m!^((?:\s+|/\*.*?\*/|//.*?\n)+)!sg;

	my $licenses = $1;

	$min =~ s!^((?:\s+|/\*.*?\*/|//.*?\n)+)!/* See LICENCES.txt for a detailed listing of used licences. */\n!sg;

	open MIN, ">", "dist/excite.min.js";
	print MIN $min;
	close MIN;

	open LICENCES, ">", "dist/LICENCES.txt";
	say LICENCES `cat src/LICENSE.txt`;
	print LICENCES $licenses;
	close LICENCES;
}

sub zip {
	my $ZIP_DIR = "excite-$VERSION";

	system "cp", "-r", "dist", $ZIP_DIR;

	system "zip", "-x", "*.mdproj", "-x", "*.zip", "-r", "$ZIP_DIR.zip", $ZIP_DIR;
	system "mv", "-v", "$ZIP_DIR.zip", "dist/excite.zip";

	system "rm", "-v", "-r", $ZIP_DIR;
}

exit if $VERSION =~ /a$/;

say "Making version '$VERSION' now.";

check_version;
dist;
licenses;
zip;
