package com.example.usersystem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.usersystem.entity.UserEntity;
import com.example.usersystem.model.User;
import com.example.usersystem.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;
	@Autowired
	PasswordEncoder encoder;

    @Override
    public User saveUser(User user) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);
        String encodedPass = encoder.encode(user.getPassword());
        userEntity.setPassword(encodedPass);
        userRepository.save(userEntity);
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        List<UserEntity> userEntities
                = userRepository.findAll();

        List<User> users = userEntities
                .stream()
                .map(userEntity -> {
                    User user = new User();
                    BeanUtils.copyProperties(userEntity, user);
                    return user;
                })
                .collect(Collectors.toList());

        return users;
    }

    @Override
    public User getUserById(Long id) {
        UserEntity userEntity
                = userRepository.findById(id).get();
        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        return user;
    }

    @Override
    public boolean deleteUser(Long id) {
        UserEntity user =  userRepository.findById(id).get();
        userRepository.delete(user);
        return true;
    }

    @Override
    public User updateUser(Long id, User user) {
        UserEntity userEntity =
                userRepository.findById(id).get();
        userEntity.setEmail(user.getEmail());
        userEntity.setUsername(user.getUsername());
        userEntity.setRole(user.getRole());
        String encodedPass = encoder.encode(user.getPassword());
        userEntity.setPassword(encodedPass);

        userRepository.save(userEntity);
        return user;
    }

}