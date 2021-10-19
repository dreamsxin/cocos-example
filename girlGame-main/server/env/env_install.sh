#!/usr/bin/env bash

RDS_VER="6.0.8"
MYSQL_APT_CFG_VER="0.8.15-1"

ubuntu_env_setup() {
    apt install curl -y

    # node
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt install nodejs -y
    npm -g i n
    n lts
    echo "Installing node done."

    # redis
    apt install gcc g++
    cd deps
    tar zxvf redis-6.0.8.tar.gz
    cd redis-6.0.8
    make && make install
    make clean
    echo "Installing redis done."
    
    # mysql
    dpkg -i mysql-apt-config_${MYSQL_APT_CFG_VER}_all.deb
    apt update -y
    apt install mysql-server -y
    echo "Installing mysql done."

    # rabbitmq
    curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc | sudo apt-key add -
    apt install apt-transport-https
    cp rabbitmq_configs/bintray.erlang.list /etc/apt/sources.list.d/
    apt update -y 
    apt install -y erlang-base \
        erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
        erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
        erlang-runtime-tools erlang-snmp erlang-ssl \
        erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

    apt install rabbitmq-server -y --fix-missing
    rabbitmq-plugins enable rabbitmq_management

    cd ..
    rm -Rf deps

    echo "Setup game runtime environment done."
}

centos_env_setup() {
    # disk
    echo "n
    p
    1


    w" | fdisk /dev/vdb && mkfs.ext4 /dev/vdb1
    fdisk -l
    mkdir -p /mnt/data
    mount /dev/vdb1 /mnt/data
    df -TH
    echo "/dev/vdb1 /mnt/data ext4 defaults 0 0" >> /etc/fstab
    cat /etc/fstab
    echo "Installing disk done."

    # node
    curl -sL https://rpm.nodesource.com/setup_lts.x | bash - && yum install -y nodejs
    npm i -g n
    n lts
    echo "Installing node done."
}

if [[ -f /usr/bin/lsb_release ]]; then
    OS=$(/usr/bin/lsb_release -a |grep Description |awk -F : '{print $2}' |sed 's/^[ \t]*//g')
else
    OS=$(cat /etc/issue |sed -n '1p')
fi

Line="====================================="
echo -e "${Line}\nOS:\n${OS}\n${Line}"

if [[ $(echo ${OS} | grep "Ubuntu") != "" ]]
then
	ubuntu_env_setup
elif [[ $(echo ${OS} | grep "CentOS") != "" ]]
then
	centos_env_setup
else
	echo "Unknown System"
fi